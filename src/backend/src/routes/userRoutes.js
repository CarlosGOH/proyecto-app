// backend/src/routes/userRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
    getMe, 
    updateProfile, 
    updatePreferences,
    changePassword,
    changeEmail
} from '../controllers/userController.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.get('/me', getMe);
router.put('/profile', updateProfile);
router.put('/preferences', updatePreferences);
router.put('/change-password', changePassword);
router.put('/change-email', changeEmail);

export default router;