const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    // 비동기 함수와 동기 코드의 순서를 await로 맞추기
    const exUser = await User.findOne({ // 이메일 중복체크
      where: {
        email: req.body.email,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.log(error);
    next(error); // status 500
  }
});

module.exports = router;