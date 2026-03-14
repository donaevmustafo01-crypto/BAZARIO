const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { plan, search, limit=20, page=1 } = req.query;
    const filter = { isActive: true };
    if (plan && plan !== 'all') filter.plan = plan;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const shops = await Shop.find(filter).sort({ plan: -1, rating: -1 }).skip((page-1)*limit).limit(Number(limit));
    const total = await Shop.countDocuments(filter);
    res.json({ success: true, shops, total });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.get('/admin/pending', auth, adminOnly, async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: false }).populate('owner','name phone');
    res.json({ success: true, shops });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner','name phone');
    if (!shop) return res.status(404).json({ message: 'Ёфт нашуд' });
    res.json({ success: true, shop });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const existing = await Shop.findOne({ owner: req.user.id });
    if (existing) return res.status(400).json({ message: 'Шумо аллакай дӯкон доред' });
    const shop = await Shop.create({ ...req.body, owner: req.user.id, isActive: false });
    await User.findByIdAndUpdate(req.user.id, { role: 'seller', shopId: shop._id });
    res.status(201).json({ success: true, shop, message: 'Дӯкон сохта шуд. Баъд аз пардохт фаъол мешавад.' });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ', error: err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, shop });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.post('/:id/activate', auth, adminOnly, async (req, res) => {
  try {
    const { plan } = req.body;
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    const shop = await Shop.findByIdAndUpdate(req.params.id, { isActive: true, plan, planExpiresAt: expires, isVerified: true }, { new: true });
    res.json({ success: true, shop });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.post('/:id/follow', auth, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    const idx = shop.followers.indexOf(req.user.id);
    if (idx > -1) shop.followers.splice(idx, 1);
    else shop.followers.push(req.user.id);
    await shop.save();
    res.json({ success: true, followers: shop.followers.length });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

module.exports = router;
