// backend/src/routes/paymentRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { 
    processPayment, 
    getPaymentHistory,
    getDefaultPaymentMethod
} from '../controllers/paymentController.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.post('/pay', restrictTo('vidente', 'discapacidad_visual'), processPayment);
router.get('/history', getPaymentHistory);
router.get('/default-method', getDefaultPaymentMethod);

export default router;