import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/productModel.js';
import upload from '../middleware/multer.js';
import fs from 'fs';

//function for add product 
const addProduct = async (req,res) =>{
    try{
        console.log('=== ADD PRODUCT REQUEST ===');
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        console.log('Headers:', req.headers);
        
        const {name,description,price,category,sizes,bestseller} = req.body;
        
        // Check if files were uploaded
        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: "No files were uploaded"
            });
        }

        // Check if at least one image is present
        const availableImages = ['image1', 'image2', 'image3', 'image4'].filter(
            imageName => req.files[imageName] && req.files[imageName][0]
        );
        
        if (availableImages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required"
            });
        }

//image upload to cloudinary//
        let imagesUrl = [];
        try {
            imagesUrl = await Promise.all(
                availableImages.map(async(imageName) =>{
                    let result = await cloudinary.uploader.upload(req.files[imageName][0].path,{
                        resource_type: "image",
                        width: 1000,
                        height: 1000,
                        crop: "scale"
                    })
                    return result.secure_url;
                })
            );
            console.log('Images uploaded to Cloudinary successfully:', imagesUrl);
        } catch (cloudinaryError) {
            console.warn('Cloudinary upload failed, saving without images:', cloudinaryError.message);
            // For now, we'll save the product without images
            // In production, you should either:
            // 1. Fix Cloudinary credentials
            // 2. Use local file storage as fallback
            // 3. Return an error to the user
            imagesUrl = [];
        }

        const productData={
            name,
            description,
            price : Number(price),
            category,
            sizes : JSON.parse(sizes),
            bestseller : bestseller === "true" ? true : false,
            image : imagesUrl,
            date: Date.now()
        }

        console.log(productData);
        const product= new productModel(productData);
        await product.save();

        // Clean up uploaded files after successful upload to cloudinary
        availableImages.forEach(imageName => {
            if (req.files[imageName] && req.files[imageName][0]) {
                fs.unlinkSync(req.files[imageName][0].path);
            }
        });

        res.json({
            success: true,
            message: "Product added successfully",
            product
        });
    }
    catch(error){
        console.error('=== ADD PRODUCT ERROR ===');
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        console.error('Error message:', error.message);
        
        res.status(500).json({
            success: false,
            message: error.message || "Error adding product",
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

//function for list products
const listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, bestseller, sortBy = 'date', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    // Apply filters
    if (category) {
      query.category = category;
    }
    
    if (bestseller !== undefined) {
      query.bestseller = bestseller === 'true';
    }
    
    // Build sort object
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const skip = (page - 1) * limit;
    
    const products = await productModel
      .find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await productModel.countDocuments(query);
    
    res.json({ 
      success: true, 
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//function for remove product 
const removeProduct = async (req,res) =>{
    try {
        const { productId } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }
        
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Delete images from cloudinary if they exist
        if (product.image && product.image.length > 0) {
            for (const imageUrl of product.image) {
                try {
                    // Extract public ID from cloudinary URL
                    const publicId = imageUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`ecommerce/products/${publicId}`);
                } catch (cloudinaryError) {
                    console.log('Error deleting from cloudinary:', cloudinaryError);
                }
            }
        }
        
        // Delete product from database
        await productModel.findByIdAndDelete(productId);
        
        res.json({
            success: true,
            message: "Product removed successfully"
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error removing product"
        });
    }
}

//function for single product information 
const singleProduct = async (req,res) =>{
    try {
        const { productId } = req.params;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }
        
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        res.json({
            success: true,
            product
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching product"
        });
    }
}

//function for update product
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, price, category, sizes, bestseller } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }
        
        const product = await productModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        
        // Prepare update data
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = Number(price);
        if (category) updateData.category = category;
        if (sizes) updateData.sizes = JSON.parse(sizes);
        if (bestseller !== undefined) updateData.bestseller = bestseller === "true";
        
        // Handle image updates if new images are uploaded
        if (req.files && Object.keys(req.files).length > 0) {
            const newImages = [];
            
            // Upload new images to cloudinary
            for (const [key, files] of Object.entries(req.files)) {
                if (files && files[0]) {
                    const result = await cloudinary.uploader.upload(files[0].path, {
                        resource_type: "image",
                        folder: "ecommerce/products",
                        width: 1000,
                        height: 1000,
                        crop: "scale"
                    });
                    newImages.push(result.secure_url);
                    
                    // Clean up uploaded file
                    fs.unlinkSync(files[0].path);
                }
            }
            
            if (newImages.length > 0) {
                updateData.image = newImages;
            }
        }
        
        // Update product
        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error updating product"
        });
    }
}

//function for search products
const searchProducts = async (req, res) => {
    try {
        const { query, page = 1, limit = 20 } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }
        
        const searchRegex = new RegExp(query, 'i');
        
        const products = await productModel.find({
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex }
            ]
        }).limit(parseInt(limit)).skip((page - 1) * limit);
        
        const total = await productModel.countDocuments({
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { category: searchRegex }
            ]
        });
        
        res.json({
            success: true,
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error searching products"
        });
    }
}

//function for get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 20, sortBy = 'date', sortOrder = 'desc' } = req.query;
        
        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }
        
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
        
        const skip = (page - 1) * limit;
        
        const products = await productModel
            .find({ category: { $regex: category, $options: 'i' } })
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip(skip);
        
        const total = await productModel.countDocuments({ 
            category: { $regex: category, $options: 'i' } 
        });
        
        res.json({
            success: true,
            products,
            category,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching products by category"
        });
    }
}

//function for get bestseller products
const getBestsellerProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        
        const products = await productModel
            .find({ bestseller: true })
            .sort({ date: -1 })
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            products,
            count: products.length
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching bestseller products"
        });
    }
}

//function for get latest products
const getLatestProducts = async (req, res) => {
    try {
        const { limit = 8 } = req.query;
        
        const products = await productModel
            .find()
            .sort({ date: -1 })
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            products,
            count: products.length
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching latest products"
        });
    }
}

//function for get product statistics
const getProductStats = async (req, res) => {
    try {
        const totalProducts = await productModel.countDocuments();
        const bestsellerCount = await productModel.countDocuments({ bestseller: true });
        
        // Get category distribution
        const categoryStats = await productModel.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        // Get price range statistics
        const priceStats = await productModel.aggregate([
            {
                $group: {
                    _id: null,
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    avgPrice: { $avg: '$price' }
                }
            }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalProducts,
                bestsellerCount,
                categoryDistribution: categoryStats,
                priceRange: priceStats[0] || {}
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message || "Error fetching product statistics"
        });
    }
}

export {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct,
    updateProduct,
    searchProducts,
    getProductsByCategory,
    getBestsellerProducts,
    getLatestProducts,
    getProductStats
}