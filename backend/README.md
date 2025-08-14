# GreenChart Backend API

A complete e-commerce backend API built with Node.js, Express, MongoDB, and Cloudinary.

## Features

- 🔐 **User Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Admin authentication
  - Password hashing with bcrypt

- 🛍️ **Product Management**
  - CRUD operations for products
  - Image upload to Cloudinary
  - Product search and filtering
  - Category management
  - Bestseller tracking

- 🛒 **Shopping Cart**
  - Add/remove items
  - Size selection
  - Quantity management
  - Cart persistence

- 📦 **Order Management**
  - Order creation and tracking
  - Order status updates
  - Shipping address management
  - Payment status tracking

- 📊 **Analytics & Statistics**
  - Product statistics
  - Order analytics
  - Revenue tracking
  - User activity metrics

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd greenchart/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/greenchart
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/greenchart

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

   # Cloudinary Configuration
   CLODINARY_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key

   # Admin Configuration
   ADMIN_EMAIL=admin@greenchart.com
   ADMIN_PASSWORD=admin123456

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login

### User Management (Protected)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/cart` - Update user cart
- `GET /api/user/cart` - Get user cart
- `PUT /api/user/change-password` - Change password
- `DELETE /api/user/account` - Delete account

### Products
- `POST /api/products/add` - Add new product (Admin)
- `GET /api/products/list` - List all products
- `GET /api/products/:productId` - Get single product
- `PUT /api/products/:productId` - Update product (Admin)
- `DELETE /api/products/:productId` - Remove product (Admin)
- `GET /api/products/search` - Search products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/bestsellers` - Get bestseller products
- `GET /api/products/latest` - Get latest products
- `GET /api/products/stats` - Get product statistics

### Orders
- `POST /api/orders/create` - Create new order
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/user/:orderId` - Get single order
- `PUT /api/orders/user/:orderId/cancel` - Cancel order
- `GET /api/orders/user/stats` - Get user order statistics

### Admin Orders
- `GET /api/orders/admin/all` - Get all orders
- `PUT /api/orders/admin/:orderId/status` - Update order status
- `GET /api/orders/admin/stats` - Get admin order statistics

## Database Models

### User Model
- firstName, lastName, email, password
- cartData (JSON object for cart items)
- Timestamps

### Product Model
- name, description, price, images
- category, sizes, bestseller flag
- Creation date

### Order Model
- User reference, order number
- Items array with product details
- Shipping address, payment info
- Order status, payment status
- Timestamps

## Middleware

- **Authentication**: JWT token verification
- **Admin Authorization**: Admin-only route protection
- **File Upload**: Multer for image handling
- **Error Handling**: Global error handling middleware
- **CORS**: Cross-origin resource sharing

## File Structure

```
backend/
├── config/
│   ├── mongodb.js
│   └── cloudinary.js
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── middleware/
│   ├── auth.js
│   └── multer.js
├── models/
│   ├── userModel.js
│   ├── productModel.js
│   └── orderModel.js
├── routes/
│   ├── userRoute.js
│   ├── productRoute.js
│   └── orderRoute.js
├── uploads/
├── server.js
├── package.json
└── README.md
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS configuration
- File upload restrictions
- Admin route protection

## Error Handling

- Consistent error response format
- HTTP status codes
- Error logging
- Development vs production error details

## Testing

The API includes a test HTML file (`test-add-product.html`) for testing product creation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.
