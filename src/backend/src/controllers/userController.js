// backend/src/controllers/userController.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

// Obtener perfil del usuario actual
export const getMe = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, phone, age, emergency_contact, photo_url, created_at FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil.' });
    }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
    const { name, phone, age, emergency_contact, photo_url } = req.body;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 phone = COALESCE($2, phone), 
                 age = COALESCE($3, age), 
                 emergency_contact = COALESCE($4, emergency_contact),
                 photo_url = COALESCE($5, photo_url),
                 updated_at = NOW()
             WHERE id = $6 
             RETURNING id, name, email, role, phone, age, emergency_contact, photo_url`,
            [name, phone, age, emergency_contact, photo_url, userId]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil.' });
    }
};

// Actualizar preferencias de accesibilidad
export const updatePreferences = async (req, res) => {
    const { font_size, contrast, brightness, voice_gender } = req.body;
    const userId = req.user.id;

    try {
        const preferences = {
            font_size: font_size || 'medium',
            contrast: contrast || 'normal',
            brightness: brightness || 'normal',
            voice_gender: voice_gender || 'female'
        };

        const result = await pool.query(
            `UPDATE users 
             SET preferences = $1, updated_at = NOW()
             WHERE id = $2 
             RETURNING id, preferences`,
            [JSON.stringify(preferences), userId]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar preferencias:', error);
        res.status(500).json({ error: 'Error al actualizar preferencias.' });
    }
};

// Cambiar contraseña
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Se requieren ambas contraseñas.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' });
    }

    try {
        // Verificar contraseña actual
        const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta.' });
        }

        // Actualizar contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [hashedPassword, userId]
        );

        res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ error: 'Error al cambiar contraseña.' });
    }
};

// Cambiar email
export const changeEmail = async (req, res) => {
    const { newEmail, password } = req.body;
    const userId = req.user.id;

    if (!newEmail || !password) {
        return res.status(400).json({ error: 'Se requiere nuevo email y contraseña.' });
    }

    try {
        // Verificar contraseña
        const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }

        // Verificar que el email no esté en uso
        const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [newEmail, userId]);
        if (emailCheck.rows.length > 0) {
            return res.status(409).json({ error: 'El email ya está en uso.' });
        }

        // Actualizar email
        await pool.query(
            'UPDATE users SET email = $1, updated_at = NOW() WHERE id = $2',
            [newEmail, userId]
        );

        res.status(200).json({ message: 'Email actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al cambiar email:', error);
        res.status(500).json({ error: 'Error al cambiar email.' });
    }
};