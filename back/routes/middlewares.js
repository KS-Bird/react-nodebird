// 커스텀 미들웨어
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) { // 로그인 확인
    next(); // next함수에 인자 안주면 다음 미들웨어로 보냄
  } else {
    res.status(401).send('로그인이 필요합니다');
  }
}

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('로그인 하지 않은 사용자만 접근 가능합니다');
  }
}