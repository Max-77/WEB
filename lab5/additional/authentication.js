const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const findByUsername = require('./actionsDB').findByUsername
const createUser = require('./actionsDB').createUser
const findById = require('./actionsDB').findById

//login strategy
passport.use('local', new LocalStrategy({}, (username, password,done)=>{
    findByUsername(username)
        .then( user => {
            if (!user || !bcrypt.compareSync(password, user.password)) return done(null, false);
            return done(null, user);
            }
        )
        .catch(err => {return done(err);})
}));

//register strategy
passport.use('registartion', new LocalStrategy({}, (username, password, done)=>{

    findByUsername(username)
        .then(ifFound=>{
            if (ifFound){
                return done(null, false, new Error('User with that name already exist'));
            }
            else {
                createUser(username, password)
                    .then(user => {
                        return done(null, user);
                    })
                    .catch(err => {console.log(err); done(null, false, new Error(err.message));})
            }
        })
        .catch(err => {console.log(err); return done(null, false, new Error(err.message));})
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