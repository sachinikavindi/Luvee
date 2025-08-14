import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

// App config
const app = express()
const port = process.env.PORT || 4000 

// Connect to databases
connectDB()
connectCloudinary()

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Static files
app.use('/uploads', express.static('uploads'))

// Test basic route first
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "GreenChart API is running",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    })
})

// Test user routes only
try {
    console.log('Loading user routes...')
    const userRouter = await import('./routes/userRoute.js')
    app.use('/api/user', userRouter.default)
    console.log('✅ User routes loaded')
} catch (error) {
    console.log('❌ Error loading user routes:', error.message)
}

// Test product routes only
try {
    console.log('Loading product routes...')
    const productRouter = await import('./routes/productRoute.js')
    app.use('/api/products', productRouter.default)
    console.log('✅ Product routes loaded')
} catch (error) {
    console.log('❌ Error loading product routes:', error.message)
}

// Test order routes only
try {
    console.log('Loading order routes...')
    const orderRouter = await import('./routes/orderRoute.js')
    app.use('/api/orders', orderRouter.default)
    console.log('✅ Order routes loaded')
} catch (error) {
    console.log('❌ Error loading order routes:', error.message)
}

// Test admin routes only
try {
    console.log('Loading admin routes...')
    const adminRouter = await import('./routes/adminRoute.js')
    app.use('/api/admin', adminRouter.default)
    console.log('✅ Admin routes loaded')
} catch (error) {
    console.log('❌ Error loading admin routes:', error.message)
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
        message: 'Route not found'
    })
})

app.listen(port, () => console.log('🚀 Server started on Port:', port))
