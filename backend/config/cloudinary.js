import {v2 as cloudinary} from "cloudinary"

const connectCloudinary = async () =>{
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        })
        
        console.log('✅ Cloudinary configured successfully');
        console.log('Cloud Name:', process.env.CLOUDINARY_NAME);
        console.log('API Key:', process.env.CLOUDINARY_API_KEY);
        console.log('API Secret:', process.env.CLOUDINARY_SECRET_KEY);
        
        // Test the connection
        const result = await cloudinary.api.ping();
        console.log('✅ Cloudinary connection test successful:', result);
        
    } catch (error) {
        console.error('❌ Cloudinary configuration failed:', error);
        throw error;
    }
}

export default connectCloudinary