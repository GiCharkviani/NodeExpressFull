const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'charkviani1616', {dialect: 'mysql', host: 'localhost'})


module.exports = sequelize;