const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const bcrypt = require('bcryptjs');

const schema = new Schema({
    username:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

schema.methods.verifyPassword = function (password){
    return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model('User', schema);

module.exports = User;
