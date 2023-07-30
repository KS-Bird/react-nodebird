const express = require('express');

const router = express.Router();
console.log(router);

router.post('/', (req, res) => { // POST /post
  res.json({ id: 1, content: 'hello' });
});

router.delete('/', (req, res) => { // DELETE /post
  res.json({ id: 1, content: 'hello' });
});

module.exports = router;