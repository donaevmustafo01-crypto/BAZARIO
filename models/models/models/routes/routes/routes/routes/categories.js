const express = require('express');
const router = express.Router();

const CATEGORIES = [
  { id: 'electronics', name: 'Электроника', emoji: '📱' },
  { id: 'clothing', name: 'Либос', emoji: '👗' },
  { id: 'home', name: 'Хона', emoji: '🏠' },
  { id: 'toys', name: 'Бозичаҳо', emoji: '🧸' },
  { id: 'auto', name: 'Авто', emoji: '🚗' },
  { id: 'food', name: 'Ғизо', emoji: '🍎' },
  { id: 'sports', name: 'Варзиш', emoji: '⚽' },
  { id: 'other', name: 'Дигар', emoji: '📦' },
];

router.get('/', (req, res) => {
  res.json({ success: true, categories: CATEGORIES });
});

module.exports = router;
