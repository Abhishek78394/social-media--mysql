module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("comments", {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true,  allowNull: false, unique:true},
      desc: {
        type: DataTypes.STRING,
        
      },
      userId: {
        type: DataTypes.INTEGER,
        // allowNull:false,
      },
      userId: {
        type: DataTypes.INTEGER,
        // allowNull:false,
      }
    });
    return Comments;
  };
  