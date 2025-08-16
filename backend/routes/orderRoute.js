import express from 'express';
import {
    createOrder,
    getUserOrders,
    getOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
    getAdminOrderStats
} from '../controllers/orderController.js';
import { authenticateToken, authenticateAdmin } from '../middleware/auth.js';

const orderRouter = express.Router();

// User routes (authentication required)
// TEMP: Remove auth for testing database save
orderRouter.post('/create', createOrder);
orderRouter.get('/user', authenticateToken, getUserOrders);
orderRouter.get('/user/:orderId', authenticateToken, getOrder);
orderRouter.put('/user/:orderId/cancel', authenticateToken, cancelOrder);
orderRouter.get('/user/stats', authenticateToken, getOrderStats);

// Admin routes (admin authentication required)
orderRouter.get('/admin/all', authenticateAdmin, getAllOrders);
orderRouter.put('/admin/:orderId/status', authenticateAdmin, updateOrderStatus);
orderRouter.get('/admin/stats', authenticateAdmin, getAdminOrderStats);

export default orderRouter;
