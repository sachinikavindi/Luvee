import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';

const adminRouter = express.Router();

// Admin dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Get counts
        const totalProducts = await productModel.countDocuments();
        const totalUsers = await userModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();
        
        // Get revenue
        const completedOrders = await orderModel.find({ 
            orderStatus: 'delivered', 
            paymentStatus: 'completed' 
        });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
        
        // Get recent orders
        const recentOrders = await orderModel
            .find()
            .sort({ orderDate: -1 })
            .limit(5)
            .populate('user', 'firstName lastName email');
        
        // Get low stock products (if you add stock field later)
        const lowStockProducts = await productModel.find().limit(5);
        
        res.json({
            success: true,
            stats: {
                totalProducts,
                totalUsers,
                totalOrders,
                totalRevenue,
                recentOrders,
                lowStockProducts
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching dashboard stats"
        });
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search } = req.query;
        
        let query = {};
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        const skip = (page - 1) * limit;
        
        const users = await userModel
            .find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);
        
        const total = await userModel.countDocuments(query);
        
        res.json({
            success: true,
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching users"
        });
    }
};

// Admin routes
adminRouter.get('/dashboard', authenticateAdmin, getDashboardStats);
adminRouter.get('/users', authenticateAdmin, getAllUsers);

export default adminRouter;
