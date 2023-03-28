const {Sequelize , DataTypes} = require('sequelize')
const sequelize = new Sequelize('social_media', 'root', '', {
    host: 'localhost',
    logging:true,
    dialect: 'mysql'
  });


sequelize.authenticate()
.then(() => {
    console.log('Connected');
}).catch((err) => {
    console.log(err);
});

const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./users')(sequelize, DataTypes);
db.posts = require('./posts')(sequelize, DataTypes);
db.comments = require('./comments')(sequelize, DataTypes);

db.sequelize.sync({force: false})
.then(() => {
    // console.log({db})
    console.log('Drop and re-sync db.');
});

module.exports = db;
