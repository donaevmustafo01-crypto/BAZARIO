const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Bazario кор мекунад!', status: 'ok' });
});

try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/shops', require('./routes/shops'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/categories', require('./routes/categories'));
} catch(e) {
  console.log('Routes хатогӣ:', e.message);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB уланди!'))
  .catch(err => console.log('MongoDB хатогӣ:', err.message));

app.listen(process.env.PORT || 5000, () => {
  console.log('🚀 Сервер кор мекунад!');
});
