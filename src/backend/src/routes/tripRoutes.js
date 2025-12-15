// backend/src/routes/tripRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { 
    requestTrip, 
    getPendingTrips, 
    updateTripStatus,
    cancelTrip,
    getTripHistory,
    getTripStatus
} from '../controllers/tripController.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

// Pasajeros: Solicitar un nuevo viaje
router.post('/request', restrictTo('vidente', 'discapacidad_visual'), requestTrip);

// Pasajeros: Cancelar viaje
router.post('/cancel', cancelTrip);

// Obtener historial de viajes (pasajeros y conductores)
router.get('/history', getTripHistory);

// Obtener estado de un viaje específico
router.get('/status/:id', getTripStatus);

// Conductores: Ver viajes pendientes
router.get('/pending', restrictTo('conductor'), getPendingTrips);

// Conductores: Aceptar o finalizar un viaje
router.patch('/update-status', restrictTo('conductor'), updateTripStatus);

export default router;