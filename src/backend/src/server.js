// backend/src/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import './config/db.js'; // Ejecuta la conexión a la DB

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Importar middlewares
import { errorHandler, notFound } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
})); 
app.use(express.json());

// Rutas de la API
app.use('/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de EyesRoute funcionando.',
        version: '1.0.0',
        endpoints: {
            auth: '/auth',
            trips: '/api/trips',
            users: '/api/users',
            payments: '/api/payments',
            reviews: '/api/reviews',
            admin: '/api/admin'
        }
    });
});

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));