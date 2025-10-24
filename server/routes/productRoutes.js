const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('admin'), upload.single('image'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
