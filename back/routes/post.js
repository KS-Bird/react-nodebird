const express = require('express');

const { Post, Comment, Image, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Comment,
      }, {
        model: Image,
      }, {
        model: User,
        attributes: {
          exclude: ['password'],
        },
      }],
    });
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다')
    }
    const comment = await Comment.create({
      content: req.body.content,
      UserId: req.body.userId,
      PostId: Number(req.params.postId),
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', (req, res) => {
  res.json({ id: 1, content: 'hello' });
});

module.exports = router;