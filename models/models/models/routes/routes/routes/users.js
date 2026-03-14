const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('shopId');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, address, city } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email, address, city }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.get('/admin/all', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

router.put('/admin/:id/block', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

module.exports = router;
