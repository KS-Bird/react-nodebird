const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const { Post, Comment, Image, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더 없으므로 생성합니다');
  fs.mkdirSync('uploads');
}

const upload = multer({ // multipart/form-data
  storage: multer.diskStorage({ // 하드디스크에 저장
    destination(req, file, done) {
      done(null, 'uploads'); // uploads 폴더에 저장
    },
    filename(req, file, done) { // 이름.png
      const ext = path.extname(file.originalname); // .png
      const basename = path.basename(file.originalname, ext) // 이름
      done(null, basename + '_' + new Date().getTime() + ext); // 이름155132.png
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    if (req.body.image) {
      if (Array.isArray(req.body.image)) { // 이미지 여러장
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else { // 이미지 한장
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [{
        model: Comment,
        include: [{
          model: User, // 댓글작성자
          attributes: ['id', 'nickname'],
        }],
      }, {
        model: Image,
      }, {
        model: User, // 게시글작성자
        attributes: ['id', 'nickname'],
      }, {
        model: User, // 좋아요누른사람
        as: 'Likers',
        attributes: ['id'],
      }],
    });
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => {
  console.log(req.files);
  res.json(req.files.map((v) => v.filename));
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
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.json({ PostId: Number(req.params.postId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;