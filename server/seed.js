const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Hayan Pullman Loaf',
    description: 'Our signature milk loaf made with levain, tangzhong, and butter. Soft, chewy, and deeply milky in flavor.',
    category: 'bread',
    price: 15.0,
    available: true,
    ingredients: ['flour', 'milk', 'butter', 'sugar', 'salt', 'levain', 'yeast']
  },
  {
    name: 'Overnight Milk Pullman Loaf',
    description: 'Classic Korean-style milk loaf made entirely with milk for an ultra-soft, fluffy texture and buttery aroma.',
    category: 'bread',
    price: 15.0,
    available: true,
    ingredients: ['flour', 'milk', 'butter', 'sugar', 'salt', 'yeast']
  },
  {
    name: 'Cream Loaf',
    description: 'Rich, pastry-like loaf made with heavy cream and tangzhong. Melts in your mouth while keeping Hayan’s signature chew.',
    category: 'bread',
    price: 15.0,
    available: true,
    ingredients: ['flour', 'heavy cream', 'butter', 'sugar', 'salt', 'levain', 'yeast']
  },

  {
    name: 'Madeleine Lemon Vanilla',
    description: 'Soft, sweet lemon vanilla bean cake with a bright lemon glaze and a hint of rum.',
    category: 'dessert',
    price: 3.5,
    available: true,
    ingredients: ['flour', 'butter', 'eggs', 'honey', 'sugar', 'lemon', 'vanilla', 'rum']
  },
  {
    name: 'Madeleine Earl Grey',
    description: 'Delicate Earl Grey madeleine with tea leaves, tea glaze, and cornflower petals.',
    category: 'dessert',
    price: 3.5,
    available: true,
    ingredients: ['flour', 'butter', 'eggs', 'honey', 'sugar', 'Earl Grey tea', 'cornflower']
  },
  {
    name: 'Madeleine Yuza',
    description: 'Buttery cake infused with Korean yuza and honey, topped with a glossy citrus glaze.',
    category: 'dessert',
    price: 3.5,
    available: true,
    ingredients: ['flour', 'butter', 'eggs', 'honey', 'sugar', 'yuza']
  },
  {
    name: 'Financier Classic Almond',
    description: 'Rich French almond cake made with browned grass-fed butter and amaretto. Crisp edges, chewy center.',
    category: 'dessert',
    price: 3.5,
    available: true,
    ingredients: ['almond flour', 'butter', 'egg whites', 'sugar', 'amaretto']
  },
  {
    name: 'Financier White Chocolate Matcha',
    description: 'Bold matcha financier coated in creamy matcha white chocolate for a balanced finish.',
    category: 'dessert',
    price: 3.75,
    available: true,
    ingredients: ['almond flour', 'butter', 'egg whites', 'sugar', 'matcha', 'white chocolate']
  },
  {
    name: 'Financier Caramel Hazelnut',
    description: 'Soft almond financier with roasted hazelnuts and homemade golden butter caramel.',
    category: 'dessert',
    price: 4.0,
    available: true,
    ingredients: ['almond flour', 'butter', 'egg whites', 'sugar', 'hazelnut', 'caramel']
  },
  {
    name: 'Galette Bretonne',
    description: 'Crisp, buttery French shortbread made with real butter and a touch of flaky sea salt.',
    category: 'dessert',
    price: 3.5,
    available: true,
    ingredients: ['flour', 'butter', 'sugar', 'egg yolk', 'sea salt']
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
