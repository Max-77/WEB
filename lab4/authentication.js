const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const findByUsername = require('./additional/actionsDB').findByUsername
const createUser = require('./additional/actionsDB').createUser
const findById = require('./additional/actionsDB').findById

passport.use('local', new LocalStrategy({}, (username, password,done)=>{
    findByUsername(username)
        .then( user => {
            if (!user || !bcrypt.compareSync(password, user.password)) return done(null, false);
            return done(null, user);
            }
        )
        .catch(err => {return done(err);})
}));

passport.use('registartion', new LocalStrategy({}, (username, password, done)=>{

    findByUsername(username)
        .then(ifFound=>{
            if (ifFound){
                return done(null, false, new Error(" User with such username already exist"));
            }
            else {
                createUser(username, password)
                    .then(user => {
                        return done(null, user);
                    })
                    .catch(err => {console.log(err); done(null, false, new Error(err.message));})
            }
        })
        .catch(err => {return done(null, false, new Error(err.message));})
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
})

passport.deserializeUser(function(id,done){
    findById(id)
        .then(user=>{
            return done(null, user);
        })
        .catch(err => {return done(err);})
    });

module.exports = passport;