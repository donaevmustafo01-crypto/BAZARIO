const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password, referralCode } = req.body;
    if (!name || !phone || !password) return res.status(400).json({ message: 'Ҳама майдонҳоро пур кунед' });
    const exists = await User.findOne({ phone });
    if (exists) return res.status(400).json({ message: 'Ин телефон аллакай қайд шудааст' });
    let referredBy = null;
    if (referralCode) {
      const ref = await User.findOne({ referralCode });
      if (ref) { referredBy = ref._id; ref.bonusPoints += 5; await ref.save(); }
    }
    const user = await User.create({ name, phone, password, referredBy });
    if (referredBy) { user.bonusPoints = 5; await user.save(); }
    res.status(201).json({ success: true, token: genToken(user._id), user: { id: user._id, name: user.name, phone: user.phone, role: user.role, bonusPoints: user.bonusPoints, referralCode: user.referralCode } });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) return res.status(400).json({ message: 'Телефон ва паролро ворид кунед' });
    const user = await User.findOne({ phone }).populate('shopId');
    if (!user) return res.status(401).json({ message: 'Корбар ёфт нашуд' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Парол нодуруст' });
    if (!user.isActive) return res.status(403).json({ message: 'Ҳисоб банд аст' });
    res.json({ success: true, token: genToken(user._id), user: { id: user._id, name: user.name, phone: user.phone, role: user.role, bonusPoints: user.bonusPoints, referralCode: user.referralCode, shopId: user.shopId } });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ', error: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('shopId');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Хатогӣ' });
  }
});

module.exports = router;
