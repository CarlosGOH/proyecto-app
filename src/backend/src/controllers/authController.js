// backend/src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET; // Obtiene el secreto del .env

// Función para registrar un nuevo usuario
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    const validRoles = ['discapacidad_visual', 'vidente', 'conductor'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Rol no válido para registro directo.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        if (error.code === '23505') { 
            return res.status(409).json({ error: 'El email ya está registrado.' });
        }
        console.error("Error en registro:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Función para iniciar sesión
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        
        const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };

        res.status(200).json({ token, user: safeUser });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Middleware para verificar JWT
export const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token faltante.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

// Middleware para restringir acceso por rol
export const restrictTo = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'No tiene permiso para realizar esta acción.' });
    }
    next();
};