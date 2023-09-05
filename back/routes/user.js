const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Op } = require('sequelize');

const { User, Post, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

// 새로고침시 프론트 로그인 시도
router.get("/", async (req, res, next) => {
  console.log(req.headers);
  try {
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    }
    return res.status(200).json(null);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로잉 불러오기
router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    const followings = await user.getFollowings();
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로워 불러오기
router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    const followers = await user.getFollowers();
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  console.log(req.headers);
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
    });
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON();
      // 개인정보 침해 예방
      data.Posts = data.Posts.length;
      data.Followers = data.Followers.length;
      data.Followings = data.Followings.length;
      return res.status(200).json(data);
    }
    return res.status(404).json("존재하지 않는 사용자입니다.");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId/posts', async (req, res, next) => {
  try {
    const where = {userId: req.params.userId};
    if (Number(req.query.lastId)) { // 초기로딩이 아닐때
      // lastId보다 작은 10개
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User, // 댓글 작성자
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: User,
        as: 'Likers',
        attributes: ['id'],
      }, {
        model: Post,
        as: 'Retweet',
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }],
      }],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      // passport로그인
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"], // 비번 제외
        },
        include: [
          {
            model: Post, // user의 게시글
            attributes: ["id"],
          },
          {
            model: User,
            attributes: ["id"],
            as: "Followings", // user의 팔로잉
          },
          {
            model: User,
            attributes: ["id"],
            as: "Followers", // user의 팔로워
          },
        ],
      });
      // 헤더에 쿠키 포함
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout((err) => {
    req.session.destroy();
    if (err) {
      res.redirect("/");
    } else {
      res.status(200).send("로그아웃 완료");
    }
  });
});

// 회원가입
router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    // 비동기 함수와 동기 코드의 순서를 await로 맞추기
    const exUser = await User.findOne({
      // 이메일 중복체크
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    next(error); // status 500
  }
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname, // 닉네임 수정
      },
      {
        where: { id: req.user.id }, // 내 아이디
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// 팔로잉
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("존재하지 않는 유저 팔로우");
    }
    await user.addFollowers(req.user.id);
    res.status(200).json({ UserId: Number(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로잉 취소
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("존재하지 않는 유저 언팔로우");
    }
    await user.removeFollowers(req.user.id);
    res.status(200).json({ UserId: Number(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 팔로워 제거
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!user) {
      res.status(403).send("존재하지 않는 유저 차단");
    }
    await user.removeFollowings(req.user.id);
    res.status(200).json({ UserId: Number(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
