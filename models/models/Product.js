const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  emoji: { type: String, default: '📦' },
  stock: { type: Number, default: 0 },
  weight: { type: Number, default: 0.5 },
  badge: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.methods.calcRating = function() {
  if (!this.reviews.length) { this.rating = 0; return; }
  this.rating = this.reviews.reduce((a,r) => a + r.rating, 0) / this.reviews.length;
};

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
