const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.json({ message: 'Bazario API кор мекунад!' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB уланди!');
    app.listen(process.env.PORT || 5000, () => {
      console.log('Сервер кор мекунад!');
    });
  })
  .catch(err => console.error(err));
