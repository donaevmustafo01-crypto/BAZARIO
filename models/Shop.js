const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '🏪' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String, default: 'Душанбе' },
  phone: { type: String, default: '' },
  plan: { type: String, enum: ['basic','standard','premium'], default: 'basic' },
  planExpiresAt: { type: Date },
  isActive: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalSales: { type: Number, default: 0 },
  socialLinks: {
    telegram: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);
