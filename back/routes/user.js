const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => { // 새로고침시 프론트 로그인 시도
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [
          {
            model: Post,
            attributes: ['id'],
          }, {
            model: User,
            as: 'Followings',
            attributes: ['id'],
          }, {
            model: User,
            as: 'Followers',
            attributes: ['id'],
          }
        ]
      });
      return res.status(200).json(fullUserWithoutPassword);
    }
    return res.status(200).json(null);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => { // passport로그인
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password'], // 비번 제외
        },
        include: [{
          model: Post, // user의 게시글
          attributes: ['id'],
        }, {
          model: User,
          attributes: ['id'],
          as: 'Followings', // user의 팔로잉
        }, {
          model: User,
          attributes: ['id'],
          as: 'Followers', // user의 팔로워
        }],
      });
      // 헤더에 쿠키 포함
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post('/logout', isLoggedIn, (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect('/');
  });
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
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
    console.error(error);
    next(error); // status 500
  }
});

module.exports = router;