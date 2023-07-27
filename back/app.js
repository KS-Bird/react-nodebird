const express = require('express');

const app = express();

app.get('/', (req, res) => {
  console.log(req.url, req.method);
  res.send('hello express');
});

app.get('/api', (req, res) => {
  res.send('hello api');
});

app.get('/api/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});

app.post('/api/post', (req, res) => {
  res.json({ id: 1, content: 'hello' });
});

app.delete('/api/post', (req, res) => {
  res.json({ id: 1, content: 'hello' });
});

app.listen(3065, () => { // 3065포트로 실행
  console.log('서버실행중');
});

