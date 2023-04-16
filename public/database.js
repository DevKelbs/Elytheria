const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test', 'kelkol', 'This!sforUS!', {
    host: '184.189.60.90', // 
    port: '49171',
    dialect: 'postgres',
    logging: false,
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });


module.exports = sequelize;
