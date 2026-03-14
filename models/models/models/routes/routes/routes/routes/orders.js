const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');

const deliveryFee = (w) => w<=1?15:w<=3?25:w<=5?35:50;

router.post('/', auth, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, notes } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'Сабад холӣ аст' });
    let total = 0, weight = 0;
    const orderItems = [];
    for (const item of items) {
      const p = await Product.findById(item.productId).populate('shop');
      if (!p) return res.status(404).json({ message: 'Маҳсулот ёфт нашуд' });
      if (p.stock < item.quantity) return res.status(400).json({ message: p.name + ' захираи кофӣ нест' });
      orderItems.push({ product: p._id, shop: p.shop._id, name: p.name, price: p.price, quantity: item.quantity, emoji: p.emoji });
      total += p.price * item.quantity;
      weight += p.weight * item.quantity;
      p.stock -= item.quantity;
      p.sold += item.quantity;
      await p.save();
    }
    const order = await Order.create({ buyer: req.user.id, items: orderItems, totalAmount: total, deliveryFee: deliveryFee(weight), totalWeight: weight, deliveryAddress, paymentMethod: paymentMethod||'cod', notes });
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ', error: err.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.get('/shop', auth, async (req, res) => {
  try {
    const orders = await Order.find({ 'items.shop': req.user.shopId }).sort({ createdAt: -1 }).populate('buyer','name phone');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('buyer','name phone');
    const total = await Order.countDocuments();
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

module.exports = router;
