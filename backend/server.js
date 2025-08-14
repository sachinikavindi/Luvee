import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'
import adminRouter from './routes/adminRoute.js'

// App config
const app = express()
const port = process.env.PORT || 3000 

// Middleware - Load these BEFORE database connections
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        process.env.ADMIN_URL || 'http://localhost:3001'
    ],
    credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Static files
app.use('/uploads', express.static('uploads'))

// API endpoints - Load routes BEFORE database connections
app.use('/api/user', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/admin', adminRouter)

// Health check
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "GreenChart API is running",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    })
})

// Health check endpoint for testing
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        routes: {
            products: '/api/products',
            users: '/api/user',
            orders: '/api/orders',
            admin: '/api/admin'
        }
    })
})

// Connect to databases AFTER routes are loaded
const initializeServer = async () => {
    try {
        // Try to connect to MongoDB (but don't fail if it doesn't work)
        try {
            await connectDB()
        } catch (dbError) {
            console.log('⚠️ MongoDB connection failed, but server will continue running')
            console.log('⚠️ Some features may not work without database connection')
        }

        // Try to connect to Cloudinary (but don't fail if it doesn't work)
        try {
            await connectCloudinary()
        } catch (cloudinaryError) {
            console.log('⚠️ Cloudinary connection failed, but server will continue running')
            console.log('⚠️ Image uploads may not work without Cloudinary connection')
        }

        // Start the server
        app.listen(port, () => {
            console.log('🚀 Backend Server started on Port:', port)
            console.log('✅ Routes loaded successfully')
            console.log('📡 API endpoints available at /api/*')
        })
    } catch (error) {
        console.error('❌ Server initialization failed:', error)
        process.exit(1)
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    })
})

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path,
        availableRoutes: [
            '/',
            '/health',
            '/api/products/*',
            '/api/user/*',
            '/api/orders/*',
            '/api/admin/*'
        ]
    })
})

// Initialize the server
initializeServer()

