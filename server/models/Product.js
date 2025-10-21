const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['bread', 'dessert', 'special']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  image: {
    type: String,
    default: '/images/default-product.jpg'
  },
  available: {
    type: Boolean,
    default: true
  },
  ingredients: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
