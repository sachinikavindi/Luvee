# 🚀 Quick Setup Guide

## 1. Environment Setup

Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/greenchart
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
ADMIN_EMAIL=admin@greenchart.com
ADMIN_PASSWORD=admin123456
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start MongoDB

Make sure MongoDB is running on your system.

## 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 5. Test the API

```bash
npm test
```

## 6. Verify Installation

Visit: `http://localhost:3000`

You should see:
```json
{
  "success": true,
  "message": "GreenChart API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## 🎯 What's Working Now

✅ **Complete Backend API**
- User authentication & management
- Product CRUD operations
- Order management
- Shopping cart functionality
- Admin dashboard
- File upload to Cloudinary
- JWT authentication
- MongoDB integration

✅ **API Endpoints**
- `/api/user/*` - User management
- `/api/products/*` - Product management
- `/api/orders/*` - Order management
- `/api/admin/*` - Admin functions

✅ **Security Features**
- Password hashing
- JWT tokens
- Admin authorization
- Input validation

## 🔧 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in .env

**Cloudinary Error:**
- Verify Cloudinary credentials
- Check image upload permissions

**Port Already in Use:**
- Change PORT in .env file
- Kill existing process on port 3000

## 📱 Port Configuration

- **Backend API**: Port 3000
- **Frontend**: Port 3000  
- **Admin Panel**: Port 3001

## 🎉 You're Ready!

Your GreenChart backend is now fully functional and ready to power your e-commerce website!
