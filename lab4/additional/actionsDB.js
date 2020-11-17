const db = require('./database').db
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs')

const User = require('../models/user')(db, Sequelize)

async function findByUsername(username) {
    return await User.findOne({
        where: {
            name: username
        }
    });
}

async function findAllUsers() {
    return await User.findAll();
}

async function createUser(username, password){
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    let user = User.build({
        name: username,
        password: hash,
    })
    return await user.save();
}

async function findById(id){
    return await User.findOne({where: {id:id}});
}

exports.findAllUsers = findAllUsers
exports.findByUsername = findByUsername
exports.createUser = createUser
exports.findById = findById
