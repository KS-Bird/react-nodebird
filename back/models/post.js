module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    content: {
      type: DataTypes.TEXT, // 글자 무제한
      allowNull: false,
    },
    // id
    // UserId
    // RetweetId
  }, {
    charset: 'utf8mb4', // 이모티콘 사용하려면 utf8mb4
    collate: 'utf8mb4_general_ci',
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    db.Post.belongsTo(db.Post, { as: 'Retweet' });
  };
  return Post;
}