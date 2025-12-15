// backend/src/routes/reviewRoutes.js
import express from 'express';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { 
    createReview, 
    getDriverReviews,
    getMyReviews
} from '../controllers/reviewController.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.post('/', restrictTo('vidente', 'discapacidad_visual'), createReview);
router.get('/driver/:driver_id', getDriverReviews);
router.get('/my-reviews', getMyReviews);

export default router;