// backend/src/controllers/paymentController.js
import pool from '../config/db.js';

// Procesar pago (simulado)
export const processPayment = async (req, res) => {
    const { trip_id, amount, payment_method } = req.body;
    const user_id = req.user.id;

    if (!trip_id || !amount) {
        return res.status(400).json({ error: 'Se requiere trip_id y amount.' });
    }

    try {
        // Verificar que el viaje existe y pertenece al usuario
        const tripCheck = await pool.query(
            'SELECT * FROM trips WHERE id = $1 AND passenger_id = $2',
            [trip_id, user_id]
        );

        if (tripCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Viaje no encontrado.' });
        }

        // Simular procesamiento de pago
        const result = await pool.query(
            `INSERT INTO payments (user_id, trip_id, amount, payment_method, status) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [user_id, trip_id, amount, payment_method || 'google_pay', 'completado']
        );

        // Actualizar estado del viaje a pagado
        await pool.query(
            'UPDATE trips SET payment_status = $1 WHERE id = $2',
            ['pagado', trip_id]
        );

        res.status(201).json({
            message: 'Pago procesado exitosamente.',
            payment: result.rows[0]
        });
    } catch (error) {
        console.error('Error al procesar pago:', error);
        res.status(500).json({ error: 'Error al procesar pago.' });
    }
};

// Obtener historial de pagos
export const getPaymentHistory = async (req, res) => {
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            `SELECT p.*, t.origin, t.destination, t.created_at as trip_date
             FROM payments p
             JOIN trips t ON p.trip_id = t.id
             WHERE p.user_id = $1
             ORDER BY p.created_at DESC
             LIMIT 50`,
            [user_id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener historial de pagos:', error);
        res.status(500).json({ error: 'Error al obtener historial de pagos.' });
    }
};

// Obtener método de pago predeterminado (simulado)
export const getDefaultPaymentMethod = async (req, res) => {
    const user_id = req.user.id;

    try {
        // En una app real, esto vendría de una tabla de métodos de pago
        res.status(200).json({
            method: 'google_pay',
            last_four: '****',
            is_default: true
        });
    } catch (error) {
        console.error('Error al obtener método de pago:', error);
        res.status(500).json({ error: 'Error al obtener método de pago.' });
    }
};