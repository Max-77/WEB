const passport = require('passport');
const User = require('./models/user')
const bcrypt = require('bcryptjs');

function login(req,res,next){
    passport.authenticate('local',
        function(err, user) {
            if (err){
                next(err);
            }
            req.logIn(user, function(err) {
                if (err) {
                    next(new Error("Incorrect username or password"));
                    return;
                }
                res.redirect('/profile');
            });
        }
    )(req, res, next);
}

function logout(req,res){
    req.logout();
    res.redirect('/');
}

function register(req,res,next){
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);

    let user = new User({username:req.body.username, password:hash});
    user.save(function(err){
        if(err){
            next(new Error("User with such username already exist"));
            return;
        }
        req.logIn(user, function(err){
            if (err) {
                next(err);
            }
            res.redirect('/profile');
        });
    });
}

module.exports.login = login;
module.exports.logout = logout;
module.exports.register = register;