const passport = require('../authentication')

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

function logout(req,res,next){
    req.logout();
    res.redirect('/');
}

module.exports.login = login
module.exports.logout = logout