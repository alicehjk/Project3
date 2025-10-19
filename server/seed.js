const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Traditional Sourdough',
    description: 'Classic Korean-style sourdough with a crispy crust and soft interior',
    category: 'bread',
    price: 12.99,
    available: true,
    ingredients: ['flour', 'water', 'salt', 'sourdough starter']
  },
  {
    name: 'Red Bean Pastry',
    description: 'Sweet pastry filled with traditional red bean paste',
    category: 'pastry',
    price: 4.99,
    available: true,
    ingredients: ['flour', 'red bean', 'sugar', 'butter']
  },
  {
    name: 'Cream Cheese Bread',
    description: 'Soft brioche filled with cream cheese',
    category: 'bread',
    price: 5.99,
    available: true,
    ingredients: ['flour', 'cream cheese', 'sugar', 'eggs', 'butter']
  },
  {
    name: 'Financier',
    description: 'French almond cake with a delicate texture',
    category: 'pastry',
    price: 3.99,
    available: true,
    ingredients: ['almond flour', 'butter', 'egg whites', 'sugar']
  },
  {
    name: 'Croissant',
    description: 'Buttery, flaky croissant made fresh daily',
    category: 'pastry',
    price: 4.50,
    available: true,
    ingredients: ['flour', 'butter', 'yeast', 'milk']
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with ganache frosting',
    category: 'cake',
    price: 35.00,
    available: true,
    ingredients: ['chocolate', 'flour', 'eggs', 'sugar', 'butter']
  },
  {
    name: 'Milk Bread',
    description: 'Soft and fluffy Japanese-style milk bread',
    category: 'bread',
    price: 8.99,
    available: true,
    ingredients: ['flour', 'milk', 'sugar', 'butter', 'yeast']
  },
  {
    name: 'Seasonal Special',
    description: 'Chef\'s special creation - changes weekly',
    category: 'special',
    price: 15.99,
    available: false,
    ingredients: ['seasonal ingredients']
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Clear existing products
    await Product.deleteMany();
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully');

    console.log('\nSeeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
