const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const path = require('hpp');
const path = require('helmet');

const db = require('./models');
const passportConfig = require('./passport');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const postsRouter = require('./routes/posts');
const hashtagRouter = require('./routes/hashtag');

dotenv.config();
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();
const app = express();

if(process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}
// 프론트에서 "localhost3065/이미지경로"로 접근가능하게 함
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(express.json()); // 프론트에서 오는 json을 req.body에 넣어줌
app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
app.use(cors({
  origin: ['http://localhost:3000', 'nodebird.com'],
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
app.use(morgan('dev'));

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(3065, () => {
  console.log('3065포트 서버실행중');
});