import express from 'express';
import { 
    loginUser,
    registerUser, 
    adminLogin,
    getUserProfile,
    updateUserProfile,
    updateUserCart,
    getUserCart,
    changePassword,
    deleteUserAccount
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const userRouter = express.Router();

// Public routes (no authentication required)
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

// Protected routes (authentication required)
userRouter.get('/profile', authenticateToken, getUserProfile);
userRouter.put('/profile', authenticateToken, updateUserProfile);
userRouter.put('/cart', authenticateToken, updateUserCart);
userRouter.get('/cart', authenticateToken, getUserCart);
userRouter.put('/change-password', authenticateToken, changePassword);
userRouter.delete('/account', authenticateToken, deleteUserAccount);

export default userRouter;