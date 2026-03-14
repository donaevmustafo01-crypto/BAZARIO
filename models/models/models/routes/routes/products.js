const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const auth = require('../middleware/auth');
const { sellerOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category, search, sort, shop, limit=20, page=1 } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'all') filter.category = category;
    if (shop) filter.shop = shop;
    if (search) filter.$text = { $search: search };
    let sortObj = {};
    if (sort === 'asc') sortObj.price = 1;
    else if (sort === 'desc') sortObj.price = -1;
    else sortObj.sold = -1;
    const products = await Product.find(filter).sort(sortObj).skip((page-1)*limit).limit(Number(limit)).populate('shop','name logo city rating');
    const total = await Product.countDocuments(filter);
    res.json({ success: true, products, total });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('shop','name logo city rating isVerified phone').populate('reviews.user','name');
    if (!product) return res.status(404).json({ message: 'Ёфт нашуд' });
    product.views += 1;
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.post('/', auth, sellerOnly, async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user.id, isActive: true });
    if (!shop) return res.status(403).json({ message: 'Фаъол дӯкон надоред' });
    const product = await Product.create({ ...req.body, shop: shop._id });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ', error: err.message });
  }
});

router.put('/:id', auth, sellerOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.delete('/:id', auth, sellerOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Нест шуд' });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Ёфт нашуд' });
    const already = product.reviews.find(r => r.user.toString() === req.user.id);
    if (already) return res.status(400).json({ message: 'Шумо аллакай шарҳ навиштед' });
    product.reviews.push({ user: req.user.id, rating, comment });
    product.calcRating();
    await product.save();
    res.json({ success: true, message: 'Шарҳ илова шуд' });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

module.exports = router;
