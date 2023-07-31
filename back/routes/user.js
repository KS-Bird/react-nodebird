const express = require('express');
const bcrypt = requrie('bcrypt');
const { User } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const exUser = await User.findOne({ // 이메일 중복체크
      where: {
        email: req.body.email,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // create함수는 비동기라 밑의 res.json()과 순서가 안 맞음
    // => await로 순서문제 해결
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: req.body.password,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.log(error);
    next(error); // status 500
  }
});

module.exports = router;