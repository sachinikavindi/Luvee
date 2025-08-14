import express from 'express';
import { 
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
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';

const productRouter = express.Router();

// Product CRUD operations
productRouter.post(
  '/add',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// Specific routes must come BEFORE parameterized routes
productRouter.get('/list', listProducts);
productRouter.get('/search', searchProducts);
productRouter.get('/bestsellers', getBestsellerProducts);
productRouter.get('/latest', getLatestProducts);
productRouter.get('/stats', getProductStats);
productRouter.get('/category/:category', getProductsByCategory);

// Parameterized routes must come LAST
productRouter.get('/:productId', singleProduct);
productRouter.put('/:productId', updateProduct);
productRouter.delete('/:productId', removeProduct);

export default productRouter;

