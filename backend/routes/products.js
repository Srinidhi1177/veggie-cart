const router = require('express').Router();
const Product = require('../models/Product');

const seedProducts = [
  { name: 'Tomato', price: 30, stock: 200, emoji: '🍅', image: 'https://images.unsplash.com/photo-1546470427-e5380b0d8c0d?w=400', description: 'Fresh, ripe tomatoes from local farms', unit: 'kg' },
  { name: 'Potato', price: 25, stock: 300, emoji: '🥔', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', description: 'Crisp potatoes perfect for frying or boiling', unit: 'kg' },
  { name: 'Carrot', price: 40, stock: 150, emoji: '🥕', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400', description: 'Sweet, crunchy carrots packed with nutrients', unit: 'kg' },
  { name: 'Spinach', price: 20, stock: 100, emoji: '🥬', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', description: 'Fresh green spinach leaves, farm-harvested', unit: 'bunch' },
  { name: 'Broccoli', price: 60, stock: 80, emoji: '🥦', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400', description: 'Premium broccoli florets, crisp and nutritious', unit: 'kg' },
  { name: 'Onion', price: 35, stock: 400, emoji: '🧅', image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', description: 'Large, pungent onions for everyday cooking', unit: 'kg' },
  { name: 'Garlic', price: 80, stock: 200, emoji: '🧄', image: 'https://images.unsplash.com/photo-1501420193900-8e7aba92a8aa?w=400', description: 'Aromatic garlic cloves, freshly harvested', unit: '250g' },
  { name: 'Capsicum', price: 55, stock: 120, emoji: '🫑', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400', description: 'Colourful bell peppers, sweet and crunchy', unit: 'kg' },
  { name: 'Cucumber', price: 22, stock: 180, emoji: '🥒', image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400', description: 'Cool, crisp cucumbers, freshly picked', unit: 'kg' },
  { name: 'Cauliflower', price: 45, stock: 90, emoji: '🌸', image: 'https://images.unsplash.com/photo-1568584711271-6c929fb49b60?w=400', description: 'Snow-white cauliflower heads, farm fresh', unit: 'kg' },
  { name: 'Peas', price: 50, stock: 130, emoji: '🫛', image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400', description: 'Sweet green peas, perfect for curries', unit: '500g' },
  { name: 'Corn', price: 15, stock: 250, emoji: '🌽', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400', description: 'Sweet corn cobs, fresh from the field', unit: 'piece' },
];

// GET /api/products/seed (run once)
router.get('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany(seedProducts);
    res.json({ message: `Seeded ${products.length} products` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
