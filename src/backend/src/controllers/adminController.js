// backend/src/controllers/adminController.js
import pool from '../config/db.js';

// Obtener estadísticas generales
export const getStatistics = async (req, res) => {
    try {
        const totalUsers = await pool.query('SELECT COUNT(*) FROM users WHERE role != $1', ['administrador']);
        const totalDrivers = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['conductor']);
        const totalTrips = await pool.query('SELECT COUNT(*) FROM trips');
        const completedTrips = await pool.query('SELECT COUNT(*) FROM trips WHERE status = $1', ['completado']);
        const totalRevenue = await pool.query('SELECT SUM(amount) FROM payments WHERE status = $1', ['completado']);

        res.status(200).json({
            total_users: parseInt(totalUsers.rows[0].count),
            total_drivers: parseInt(totalDrivers.rows[0].count),
            total_trips: parseInt(totalTrips.rows[0].count),
            completed_trips: parseInt(completedTrips.rows[0].count),
            total_revenue: parseFloat(totalRevenue.rows[0].sum || 0)
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas.' });
    }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, role, phone, created_at, updated_at 
             FROM users 
             WHERE role != $1 
             ORDER BY created_at DESC`,
            ['administrador']
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios.' });
    }
};

// Obtener todos los conductores
export const getAllDrivers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT u.id, u.name, u.email, u.phone, u.created_at,
                    COUNT(t.id) as total_trips,
                    AVG(r.rating) as average_rating
             FROM users u
             LEFT JOIN trips t ON u.id = t.driver_id
             LEFT JOIN reviews r ON u.id = r.driver_id
             WHERE u.role = $1
             GROUP BY u.id
             ORDER BY u.created_at DESC`,
            ['conductor']
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener conductores:', error);
        res.status(500).json({ error: 'Error al obtener conductores.' });
    }
};

// Obtener todos los viajes
export const getAllTrips = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT t.*, 
                    p.name as passenger_name, 
                    d.name as driver_name
             FROM trips t
             JOIN users p ON t.passenger_id = p.id
             LEFT JOIN users d ON t.driver_id = d.id
             ORDER BY t.created_at DESC
             LIMIT 100`
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener viajes:', error);
        res.status(500).json({ error: 'Error al obtener viajes.' });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, phone } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 email = COALESCE($2, email), 
                 role = COALESCE($3, role),
                 phone = COALESCE($4, phone),
                 updated_at = NOW()
             WHERE id = $5 
             RETURNING id, name, email, role, phone`,
            [name, email, role, phone, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario.' });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario.' });
    }
};