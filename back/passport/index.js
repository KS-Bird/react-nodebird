const passport = require('passport');
const local = require('./local');

const { User } = require('../models');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id); // 서버 세션에는 id만 들고 있을 것임
  });

  // 로그인 후 라우터 실행될때마다 실행됨
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user가 됨
    } catch (error) {
      console.error(error);
      done(error);
    }
  });

  local(); // 우리 웹사이트의 로그인 전략
}