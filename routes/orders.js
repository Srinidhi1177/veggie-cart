const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/orders/create-razorpay-order
// Creates a Razorpay order and returns order_id for frontend
router.post('/create-razorpay-order', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    const totalAmount = cart.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity, 0
    );
    const deliveryFee = totalAmount >= 299 ? 0 : 40;
    const finalAmount = totalAmount + deliveryFee;

    // Razorpay expects amount in paise (1 INR = 100 paise)
    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders/verify-and-place
// Verifies Razorpay signature then saves order
router.post('/verify-and-place', auth, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, address } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature)
      return res.status(400).json({ message: 'Payment verification failed' });

    // Fetch cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    const items = cart.items.map(i => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = totalAmount >= 299 ? 0 : 40;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount: totalAmount + deliveryFee,
      paymentStatus: 'paid',
      paymentId: razorpayPaymentId,
      address: address || 'Default Address',
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders/place  (Cash on Delivery)
router.post('/place', auth, async (req, res) => {
  try {
    const { address } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    const items = cart.items.map(i => ({
      product: i.product._id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = totalAmount >= 299 ? 0 : 40;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount: totalAmount + deliveryFee,
      paymentStatus: 'pending',
      paymentId: `COD_${Date.now()}`,
      address: address || 'Default Address',
    });

    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
