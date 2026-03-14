const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  emoji: { type: String, default: '📦' },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 15 },
  totalWeight: { type: Number, default: 0 },
  status: { type: String, enum: ['ordered','processing','shipped','delivered','cancelled'], default: 'ordered' },
  paymentMethod: { type: String, enum: ['cod','card','wallet'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending','paid','refunded'], default: 'pending' },
  deliveryAddress: {
    city: { type: String },
    street: { type: String },
    phone: { type: String },
  },
  notes: { type: String, default: '' },
  escrowReleased: { type: Boolean, default: false },
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const y = new Date().getFullYear();
    const r = Math.floor(Math.random()*10000).toString().padStart(4,'0');
    this.orderNumber = `BZ-${y}-${r}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
