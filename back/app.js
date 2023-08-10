const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const db = require('./models');
const passportConfig = require('./passport');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

dotenv.config();
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();
const app = express();

// 서버 설정
// 위에서 아래로 순차 실행되기 때문에 
// 아래 라인들이 router보다 위에 있어야함
app.use(express.json()); // json형태 데이터를 req.body에 넣어줌
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

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

// 에러처리 미들웨어 // next(인자)시 실행됨
app.use((err, req, res, next) => {

});

app.listen(3065, () => { // 서버를 3065포트로 실행
  console.log('3065포트 서버실행중');
});

