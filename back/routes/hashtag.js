const express = require('express');
const { Op } = require('sequelize');

const {Post, Hashtag, Image, Comment, User} = require('../models');

const router = express.Router();

router.get('/:hashtag/posts', async (req, res, next) => {
  try {
    const where = {};
    if (Number(req.query.lastId)) { // 초기로딩이 아닐때
      // lastId보다 작은 10개
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const posts = await Post.findAll({
      where, // 조건1
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [{
        model: Hashtag,
        where: {name: req.params.hashtag}, // 조건2 (조건1, 조건2 동시만족하는 레코드 선택됨)
      }, {
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

module.exports = router;