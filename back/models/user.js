module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // mysql에는 users 테이블 생성
    // id가 기본적으로 들어있음
    email: {
      type: DataTypes.STRING(30),
      allowNull: false, // 필수값
      unique: true, // 고유한값
    },
    nickame: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100), // 암호화하면 길이가 길어짐
      allowNull: false,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글저장
  });
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
  };
  return User;
}