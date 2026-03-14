jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Ворид шавед' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Корбар ёфт нашуд' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token нодуруст' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Танҳо admin' });
  next();
};

const sellerOnly = (req, res, next) => {
  if (!['seller','admin'].includes(req.user.role)) return res.status(403).json({ message: 'Танҳо фурӯшанда' });
  next();
};

module.exports = auth;
module.exports.adminOnly = adminOnly;
module.exports.sellerOnly = sellerOnly;
