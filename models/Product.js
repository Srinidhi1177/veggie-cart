const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 100 },
  image: { type: String, required: true },
  emoji: { type: String, default: '🥦' },
  category: { type: String, default: 'Vegetables' },
  description: { type: String },
  unit: { type: String, default: 'kg' },
});

module.exports = mongoose.model('Product', productSchema);
