import {v2 as cloudinary} from 'cloudinary';

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
    try {
        console.log('Testing Cloudinary connection...');
        console.log('Cloud Name:', process.env.CLOUDINARY_NAME);
        console.log('API Key:', process.env.CLOUDINARY_API_KEY);
        console.log('API Secret:', process.env.CLOUDINARY_SECRET_KEY);
        
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });
        
        // Test the connection
        const result = await cloudinary.api.ping();
        console.log('✅ Cloudinary connection successful:', result);
        return true;
    } catch (error) {
        console.error('❌ Cloudinary connection failed:', error);
        return false;
    }
};

// Upload image to Cloudinary
const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const defaultOptions = {
            resource_type: "image",
            width: 1000,
            height: 1000,
            crop: "scale"
        };
        
        const uploadOptions = { ...defaultOptions, ...options };
        
        const result = await cloudinary.uploader.upload(filePath, uploadOptions);
        console.log('✅ Image uploaded successfully:', result.secure_url);
        return result;
    } catch (error) {
        console.error('❌ Image upload failed:', error);
        throw error;
    }
};

// Middleware to handle multiple image uploads
const processImageUploads = async (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return next(); // No files to process, continue
        }
        
        // Test connection first
        const connectionOk = await testCloudinaryConnection();
        if (!connectionOk) {
            console.warn('⚠️ Cloudinary connection failed, continuing without image upload');
            req.cloudinaryUrls = [];
            return next();
        }
        
        // Process each uploaded file
        const uploadPromises = Object.entries(req.files).map(async ([fieldName, files]) => {
            if (files && files[0]) {
                try {
                    const result = await uploadToCloudinary(files[0].path);
                    return {
                        fieldName,
                        url: result.secure_url,
                        publicId: result.public_id
                    };
                } catch (uploadError) {
                    console.error(`Failed to upload ${fieldName}:`, uploadError);
                    return null;
                }
            }
            return null;
        });
        
        const uploadResults = await Promise.all(uploadPromises);
        req.cloudinaryUrls = uploadResults.filter(result => result !== null);
        
        console.log('✅ All images processed:', req.cloudinaryUrls);
        next();
        
    } catch (error) {
        console.error('❌ Image processing middleware error:', error);
        req.cloudinaryUrls = [];
        next(); // Continue even if upload fails
    }
};

export { testCloudinaryConnection, uploadToCloudinary, processImageUploads };