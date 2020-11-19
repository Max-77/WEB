const { Sequelize } = require('sequelize');

const db = new Sequelize('lab4_db', 'postgres', 'postgres',{
     //host: 'localhost',
    host: 'my_database',
    dialect: 'postgres',

    pool: {
        max:5,
        min: 0
    }
});

exports.db = db;