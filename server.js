const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🎉 Bazario API кор мекунад!', status: 'ok' });
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Bazario backend тайёр!' });
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB уланди!');
    app.listen(process.env.PORT || 5000, () => {
      console.log('🚀 Сервер кор мекунад!');
    });
  })
  .catch(err => {
    console.error('❌ Хатогӣ:', err.message);
    process.exit(1);
  });
