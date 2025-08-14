import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import userModel from '../models/userModel.js';

// Create new order
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            items,
            shippingAddress,
            paymentMethod,
            notes
        } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order items are required"
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required"
            });
        }

        // Validate items and calculate totals
        let subtotal = 0;
        const validatedItems = [];

        for (const item of items) {
            const product = await productModel.findById(item.product);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${item.product} not found`
                });
            }

            // Validate size availability
            if (!product.sizes.includes(item.size)) {
                return res.status(400).json({
                    success: false,
                    message: `Size ${item.size} not available for ${product.name}`
                });
            }

            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            validatedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                size: item.size,
                quantity: item.quantity,
                image: product.image[0]
            });
        }

        const deliveryFee = 0; // Free delivery for now
        const total = subtotal + deliveryFee;

        // Create order
        const order = new orderModel({
            user: userId,
            items: validatedItems,
            shippingAddress,
            paymentMethod,
            notes,
            subtotal,
            deliveryFee,
            total,
            currency: 'LKR'
        });

        await order.save();

        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                total: order.total,
                orderStatus: order.orderStatus,
                paymentStatus: order.paymentStatus
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error creating order"
        });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        let query = { user: userId };
        if (status) {
            query.orderStatus = status;
        }

        const skip = (page - 1) * limit;

        const orders = await orderModel
            .find(query)
            .sort({ orderDate: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .populate('items.product', 'name image price');

        const total = await orderModel.countDocuments(query);

        res.json({
            success: true,
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalOrders: total
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching orders"
        });
    }
};

// Get single order
const getOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        const order = await orderModel
            .findOne({ _id: orderId, user: userId })
            .populate('items.product', 'name image price description category');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching order"
        });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        const order = await orderModel.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if order can be cancelled
        if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled"
            });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.json({
            success: true,
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error cancelling order"
        });
    }
};

// Admin: Get all orders
const getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, paymentStatus, search } = req.query;

        let query = {};

        if (status) {
            query.orderStatus = status;
        }

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
                { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
                { 'shippingAddress.email': { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const orders = await orderModel
            .find(query)
            .sort({ orderDate: -1 })
            .limit(parseInt(limit))
            .skip(skip)
            .populate('user', 'firstName lastName email')
            .populate('items.product', 'name image price');

        const total = await orderModel.countDocuments(query);

        res.json({
            success: true,
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalOrders: total
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching orders"
        });
    }
};

// Admin: Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus, paymentStatus, trackingNumber, estimatedDelivery, notes } = req.body;

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const updateData = {};
        if (orderStatus) updateData.orderStatus = orderStatus;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (trackingNumber) updateData.trackingNumber = trackingNumber;
        if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
        if (notes) updateData.notes = notes;

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true, runValidators: true }
        ).populate('user', 'firstName lastName email')
         .populate('items.product', 'name image price');

        res.json({
            success: true,
            message: "Order updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating order"
        });
    }
};

// Get order statistics
const getOrderStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const totalOrders = await orderModel.countDocuments({ user: userId });
        const pendingOrders = await orderModel.countDocuments({ user: userId, orderStatus: 'pending' });
        const deliveredOrders = await orderModel.countDocuments({ user: userId, orderStatus: 'delivered' });
        const cancelledOrders = await orderModel.countDocuments({ user: userId, orderStatus: 'cancelled' });

        // Calculate total spent
        const orders = await orderModel.find({ user: userId, orderStatus: 'delivered' });
        const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                totalSpent
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching order statistics"
        });
    }
};

// Admin: Get order statistics
const getAdminOrderStats = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments();
        const pendingOrders = await orderModel.countDocuments({ orderStatus: 'pending' });
        const processingOrders = await orderModel.countDocuments({ orderStatus: 'processing' });
        const shippedOrders = await orderModel.countDocuments({ orderStatus: 'shipped' });
        const deliveredOrders = await orderModel.countDocuments({ orderStatus: 'delivered' });
        const cancelledOrders = await orderModel.countDocuments({ orderStatus: 'cancelled' });

        // Revenue statistics
        const completedOrders = await orderModel.find({ 
            orderStatus: 'delivered', 
            paymentStatus: 'completed' 
        });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

        // Monthly revenue (last 6 months)
        const monthlyRevenue = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const monthOrders = await orderModel.find({
                orderDate: { $gte: monthStart, $lte: monthEnd },
                orderStatus: 'delivered',
                paymentStatus: 'completed'
            });

            const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
            monthlyRevenue.push({
                month: date.toLocaleString('default', { month: 'short' }),
                revenue: monthRevenue
            });
        }

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue,
                monthlyRevenue
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching order statistics"
        });
    }
};

export {
    createOrder,
    getUserOrders,
    getOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStats,
    getAdminOrderStats
};
