module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("posts", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,  allowNull: false, unique:true},
      desc: {
        type: DataTypes.STRING,
        
      },
      img: {
        type: DataTypes.STRING,
      },
      userId: {
        type: DataTypes.INTEGER,
        // allowNull:false,
     
      }
    });
    return Posts;
  };
  