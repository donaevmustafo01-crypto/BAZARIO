const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer','seller','admin'], default: 'buyer' },
  bonusPoints: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  isActive: { type: Boolean, default: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = 'BZ' + Math.random().toString(36).substr(2,6).toUpperCase();
  }
  next();
});

userSchema.methods.comparePassword = async function(pass) {
  return bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model('User', userSchema);
