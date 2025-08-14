import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";

//generate id after new user register//
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    cartData: user.cartData
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Route for user register
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        //checking user already exist
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        //validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter valid email"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Please enter a strong Password (minimum 8 characters)"
            });
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const user = await newUser.save()

        const token = createToken(user._id)

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                cartData: user.cartData
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // For now, using a simple admin check
        // In production, you should have an admin field in user model
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = createToken('admin');
            res.json({
                success: true,
                token,
                isAdmin: true,
                message: "Admin login successful"
            });
        } else {
            res.status(401).json({
                success: false,
                message: "Invalid admin credentials"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, email } = req.body;

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter valid email"
                });
            }
            updateData.email = email;
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Update user cart
const updateUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartData } = req.body;

        if (!cartData) {
            return res.status(400).json({
                success: false,
                message: "Cart data is required"
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { cartData },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            message: "Cart updated successfully",
            cartData: updatedUser.cartData
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get user cart
const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await userModel.findById(userId).select('cartData');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            cartData: user.cartData || {}
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Change password
const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long"
            });
        }

        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

        res.json({
            success: true,
            message: "Password changed successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Delete user account
const deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        
        await userModel.findByIdAndDelete(userId);

        res.json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export {
    loginUser,
    registerUser,
    adminLogin,
    getUserProfile,
    updateUserProfile,
    updateUserCart,
    getUserCart,
    changePassword,
    deleteUserAccount
}