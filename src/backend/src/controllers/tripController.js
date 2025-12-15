// backend/src/controllers/tripController.js
import pool from '../config/db.js';

// 1. Solicitar un nuevo viaje
export const requestTrip = async (req, res) => {
    const { origin, destination, details } = req.body;
    const passenger_id = req.user.id;
    const status = 'pendiente'; 

    try {
        const result = await pool.query(
            `INSERT INTO trips (passenger_id, origin, destination, details, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [passenger_id, origin, destination, details, status]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error al solicitar viaje:", error);
        res.status(500).json({ error: 'Error al registrar la solicitud de viaje.' });
    }
};

// 2. Ver viajes pendientes (para Conductores)
export const getPendingTrips = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, u.name as passenger_name, u.email as passenger_email, u.phone as passenger_phone
            FROM trips t 
            JOIN users u ON t.passenger_id = u.id
            WHERE t.status = 'pendiente' 
            ORDER BY t.created_at ASC
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener viajes pendientes:", error);
        res.status(500).json({ error: 'Error al obtener viajes.' });
    }
};

// 3. Aceptar o Finalizar un viaje (para Conductores)
export const updateTripStatus = async (req, res) => {
    const { trip_id, action } = req.body;
    const driver_id = req.user.id;
    let newStatus;
    
    if (action === 'aceptar') {
        newStatus = 'en_curso';
    } else if (action === 'finalizar') {
        newStatus = 'completado';
    } else {
        return res.status(400).json({ error: 'Acción no válida.' });
    }

    try {
        if (action === 'aceptar') {
            // Verificar que el viaje esté pendiente
            const tripCheck = await pool.query(
                'SELECT * FROM trips WHERE id = $1 AND status = $2',
                [trip_id, 'pendiente']
            );

            if (tripCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Viaje no disponible.' });
            }

            // Asignar conductor y cambiar estado
            await pool.query(
                `UPDATE trips 
                 SET driver_id = $1, status = $2, accepted_at = NOW(), updated_at = NOW()
                 WHERE id = $3`,
                [driver_id, newStatus, trip_id]
            );
        } else if (action === 'finalizar') {
            // Verificar que el viaje esté en curso y asignado al conductor
            const tripCheck = await pool.query(
                'SELECT * FROM trips WHERE id = $1 AND driver_id = $2 AND status = $3',
                [trip_id, driver_id, 'en_curso']
            );

            if (tripCheck.rows.length === 0) {
                return res.status(404).json({ error: 'Viaje no encontrado o no asignado a ti.' });
            }

            // Finalizar viaje
            await pool.query(
                `UPDATE trips 
                 SET status = $1, completed_at = NOW(), updated_at = NOW()
                 WHERE id = $2`,
                [newStatus, trip_id]
            );
        }

        res.status(200).json({ message: `Viaje ${newStatus} exitosamente.` });
    } catch (error) {
        console.error("Error al actualizar estado del viaje:", error);
        res.status(500).json({ error: 'Error al actualizar el estado del viaje.' });
    }
};

// 4. Cancelar un viaje
export const cancelTrip = async (req, res) => {
    const { trip_id, reason } = req.body;
    const user_id = req.user.id;

    try {
        // Verificar que el viaje existe y pertenece al usuario o es el conductor
        const tripCheck = await pool.query(
            'SELECT * FROM trips WHERE id = $1 AND (passenger_id = $2 OR driver_id = $2)',
            [trip_id, user_id]
        );

        if (tripCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Viaje no encontrado.' });
        }

        const trip = tripCheck.rows[0];

        // No se puede cancelar un viaje completado
        if (trip.status === 'completado') {
            return res.status(400).json({ error: 'No se puede cancelar un viaje completado.' });
        }

        await pool.query(
            `UPDATE trips 
             SET status = $1, cancellation_reason = $2, cancelled_by = $3, updated_at = NOW()
             WHERE id = $4`,
            ['cancelado', reason, user_id, trip_id]
        );

        res.status(200).json({ message: 'Viaje cancelado exitosamente.' });
    } catch (error) {
        console.error("Error al cancelar viaje:", error);
        res.status(500).json({ error: 'Error al cancelar viaje.' });
    }
};

// 5. Obtener historial de viajes
export const getTripHistory = async (req, res) => {
    const user_id = req.user.id;
    const role = req.user.role;

    try {
        let query;
        if (role === 'conductor') {
            query = `
                SELECT t.*, u.name as passenger_name, u.phone as passenger_phone
                FROM trips t
                JOIN users u ON t.passenger_id = u.id
                WHERE t.driver_id = $1
                ORDER BY t.created_at DESC
                LIMIT 50
            `;
        } else {
            query = `
                SELECT t.*, u.name as driver_name, u.phone as driver_phone
                FROM trips t
                LEFT JOIN users u ON t.driver_id = u.id
                WHERE t.passenger_id = $1
                ORDER BY t.created_at DESC
                LIMIT 50
            `;
        }

        const result = await pool.query(query, [user_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error al obtener historial:", error);
        res.status(500).json({ error: 'Error al obtener historial.' });
    }
};

// 6. Obtener estado de un viaje específico
export const getTripStatus = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            `SELECT t.*, 
                    p.name as passenger_name, p.phone as passenger_phone,
                    d.name as driver_name, d.phone as driver_phone
             FROM trips t
             JOIN users p ON t.passenger_id = p.id
             LEFT JOIN users d ON t.driver_id = d.id
             WHERE t.id = $1 AND (t.passenger_id = $2 OR t.driver_id = $2)`,
            [id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Viaje no encontrado.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener estado del viaje:", error);
        res.status(500).json({ error: 'Error al obtener estado del viaje.' });
    }
};