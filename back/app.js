const express = require('express');
const cors = require('cors');

const db = require('./models');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);

const app = express();

// 서버 설정
// 위에서 아래로 순차 실행되기 때문에 
// 아래 라인들이 router보다 위에 있어야함
app.use(express.json()); // json형태 데이터를 req.body에 넣어줌
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
}));

app.get('/', (req, res) => {
  console.log(req.url, req.method);
  res.send('hello express');
});

app.get('/', (req, res) => {
  res.send('hello api');
});

app.get('/posts', (req, res) => {
  res.json([
    { id: 1, content: 'hello' },
    { id: 2, content: 'hello2' },
    { id: 3, content: 'hello3' },
  ]);
});

app.use('/post', postRouter);

app.use('/user', userRouter);

app.listen(3065, () => { // 서버를 3065포트로 실행
  console.log('3065포트 서버실행중');
});

