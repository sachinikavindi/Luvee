# 🚀 GreenChart - Complete E-commerce Solution

A full-stack e-commerce application with frontend, backend API, and admin panel.

## 📁 Project Structure

```
greenchart/
├── frontend/          # React frontend (Port 3000)
├── backend/           # Node.js API (Port 3000)
├── admin/             # Admin panel (Port 3001)
├── start-all.js       # Master startup script
└── README.md          # This file
```

## 🌐 Port Configuration

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000
- **Admin Panel**: http://localhost:3001

## 🚀 Quick Start

### Option 1: Start All Services at Once
```bash
# From the root directory
node start-all.js
```

### Option 2: Start Services Individually

#### Start Backend API
```bash
cd backend
npm install
npm run dev
```

#### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Start Admin Panel
```bash
cd admin
npm install
npm run dev
```

## 🔧 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

## 📝 Environment Setup

### Backend (.env)
Create `backend/.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/greenchart
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
ADMIN_EMAIL=admin@greenchart.com
ADMIN_PASSWORD=admin123456
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## 🛠️ Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Test API endpoints

### Frontend
- `npm run dev` - Start development server (Port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Admin Panel
- `npm run dev` - Start development server (Port 3001)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🧪 Testing

### Test Backend API
```bash
cd backend
npm test
```

### Test Frontend
Visit: http://localhost:3000

### Test Admin Panel
Visit: http://localhost:3001

## 📱 Features

### Frontend
- 🛍️ Product browsing and search
- 🛒 Shopping cart functionality
- 👤 User authentication
- 💳 Checkout process
- 📱 Responsive design

### Backend API
- 🔐 JWT authentication
- 🗄️ MongoDB integration
- 📤 File upload to Cloudinary
- 📊 Order management
- 👥 User management
- 🔍 Product search and filtering

### Admin Panel
- 📊 Dashboard with analytics
- 🛍️ Product management
- 👥 User management
- 📦 Order management
- 📈 Sales reports

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Admin route protection

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill processes on specific ports
npx kill-port 3000 3001
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env

### Frontend/Admin Not Loading
- Check if ports are available
- Verify npm scripts are correct

## 📚 Documentation

- [Backend API Docs](backend/README.md)
- [Frontend Setup](frontend/README.md)
- [Admin Panel Setup](admin/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Verify all prerequisites are met
3. Check the individual README files
4. Open an issue with detailed error information

---

**Happy Coding! 🎉**
