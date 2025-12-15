// backend/src/routes/adminRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { 
    getStatistics,
    getAllUsers,
    getAllDrivers,
    getAllTrips,
    updateUser,
    deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación
router.use(restrictTo('administrador')); // Solo administradores

router.get('/statistics', getStatistics);
router.get('/users', getAllUsers);
router.get('/drivers', getAllDrivers);
router.get('/trips', getAllTrips);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;