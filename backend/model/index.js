const Sequelize = require("sequelize");

const sequelize = new Sequelize("portail", "root", "", {
    host: "localhost",
    dialect: 'mysql',

    pool: {
        max: 5,     
        min: 0,     
        idle: 10000
    }
});
const db = {};
  
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model")(sequelize, Sequelize);
db.materiel = require("./materiel.model")(sequelize, Sequelize);
db.actualite = require("./actualite.model")(sequelize, Sequelize);
module.exports = db;
