const express = require('express');
const router = express.Router();

const login = require('../additional/login_logout').login;
const findAll = require('../additional/actionsDB').findAllUsers

const hbs = require('hbs')
hbs.registerPartials('./partials');

router.use(consoleLog);

router.get('/', (req,res,next)=>{
    res.render("main.hbs", {
        content: "Welcome to website"
    })
})

router.get('/register', (req,res,next)=>{
    if (!req.isAuthenticated()){
        res.render('register.hbs', {
        action: '/register',
    });}
    else res.render('error.hbs', {
        content: "You have been authenticated yet",
        backColor: "blue"
    })
});
const passport = require('../authentication')
router.post('/register', passport.authenticate('registartion', {
    successRedirect: '/profile'
}));

router.get('/login', (req,res,next)=>{
    if (!req.isAuthenticated()){
        res.render('login.hbs', {
            action: '/login',
        });}
    else res.render('error.hbs', {
        content: "You have been authenticated yet",
        backColor: "blue"
    })
});
router.post('/login', (req,res,next)=>{
    login(req,res,next);
});

router.get('/profile', mustAuth, (req,res,next)=>{
   res.render("cabinet.hbs", {
       content: "Welcome back, " + req.user.name
   })
})

router.get('/show', (req,res)=>
    findAll()
        .then(users=>{
            res.send(users);
        })
);

router.post('/logout', (req,res,next)=>{
    require('../additional/login_logout').logout(req,res,next);
})

router.get('*', function (req, res, next) {
    next(new Error("404 Not found"));
});

router.use(renderError);

function renderError(err,req,res,next){
   console.log(req.method + ' ' + req.url + ' ' + err.message);
   res.render("error.hbs", {
       content: "There is an error " + err.message,
       backColor: "red"
   })
}

function consoleLog(req, res,next){
    console.log(req.method+' '+req.url);
    next();
}

function mustAuth(req,res,next){
    if (req.isAuthenticated()) {
        next();
        return;
    }
    next(new Error("401 Unauthorized"));
}

module.exports = router;