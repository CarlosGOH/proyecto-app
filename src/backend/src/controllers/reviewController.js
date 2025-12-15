// backend/src/controllers/reviewController.js
import pool from '../config/db.js';

// Crear una reseña
export const createReview = async (req, res) => {
    const { trip_id, driver_id, rating, comment } = req.body;
    const passenger_id = req.user.id;

    if (!trip_id || !driver_id || !rating) {
        return res.status(400).json({ error: 'Se requiere trip_id, driver_id y rating.' });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5.' });
    }

    try {
        // Verificar que el viaje existe y pertenece al usuario
        const tripCheck = await pool.query(
            'SELECT * FROM trips WHERE id = $1 AND passenger_id = $2 AND status = $3',
            [trip_id, passenger_id, 'completado']
        );

        if (tripCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Viaje no encontrado o no completado.' });
        }

        // Verificar que no haya reseña previa
        const reviewCheck = await pool.query(
            'SELECT * FROM reviews WHERE trip_id = $1 AND passenger_id = $2',
            [trip_id, passenger_id]
        );

        if (reviewCheck.rows.length > 0) {
            return res.status(409).json({ error: 'Ya has calificado este viaje.' });
        }

        const result = await pool.query(
            `INSERT INTO reviews (trip_id, driver_id, passenger_id, rating, comment) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [trip_id, driver_id, passenger_id, rating, comment]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear reseña:', error);
        res.status(500).json({ error: 'Error al crear reseña.' });
    }
};

// Obtener reseñas de un conductor
export const getDriverReviews = async (req, res) => {
    const { driver_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT r.*, u.name as passenger_name, u.photo_url as passenger_photo
             FROM reviews r
             JOIN users u ON r.passenger_id = u.id
             WHERE r.driver_id = $1
             ORDER BY r.created_at DESC
             LIMIT 20`,
            [driver_id]
        );

        // Calcular promedio
        const avgResult = await pool.query(
            'SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews FROM reviews WHERE driver_id = $1',
            [driver_id]
        );

        res.status(200).json({
            reviews: result.rows,
            average_rating: parseFloat(avgResult.rows[0].average_rating || 0).toFixed(1),
            total_reviews: parseInt(avgResult.rows[0].total_reviews || 0)
        });
    } catch (error) {
        console.error('Error al obtener reseñas:', error);
        res.status(500).json({ error: 'Error al obtener reseñas.' });
    }
};

// Obtener reseñas del usuario actual
export const getMyReviews = async (req, res) => {
    const passenger_id = req.user.id;

    try {
        const result = await pool.query(
            `SELECT r.*, u.name as driver_name, t.origin, t.destination
             FROM reviews r
             JOIN users u ON r.driver_id = u.id
             JOIN trips t ON r.trip_id = t.id
             WHERE r.passenger_id = $1
             ORDER BY r.created_at DESC`,
            [passenger_id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener mis reseñas:', error);
        res.status(500).json({ error: 'Error al obtener mis reseñas.' });
    }
};