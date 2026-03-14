const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Bazario кор мекунад!', status: 'ok' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Сервер кор мекунад!');
});
