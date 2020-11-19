const express = require('express');
const router = express.Router();

const login = require('../additional/login_logout').login;
const findAll = require('../additional/actionsDB').findAllUsers
const findByUsername = require('../additional/actionsDB').findByUsername
const createUser = require('../additional/actionsDB').createUser
const editUser = require('../additional/actionsDB').editUser
const deleteUser = require('../additional/actionsDB').deleteUser

const hbs = require('hbs')
hbs.registerPartials('./partials');

router.use(consoleLog);

// -------------------------Standart routes-------------------------//

router.get('/', (req,res,next)=>{
    res.render("main.hbs", {
        content: "Welcome to website"
    })
})

router.get('/register', (req,res,next)=>{
    if (!req.isAuthenticated()){
        let message = ''
        if (req.query.err === 'true') {
            message = "User with such username already exist";
        }
        res.render('register.hbs', {
        action: '/register',
        message:message
    });}
    else res.render('error.hbs', {
        content: "You have been authenticated yet",
        backColor: "blue"
    })
});
const passport = require('../additional/authentication')
router.post('/register', passport.authenticate('registartion', {
    successRedirect: '/edit',
    failureRedirect: '/register?err=true'
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

router.get('/edit', mustAuth, (req,res,next)=>{
    res.render("edit.hbs");
})
router.post('/edit', (req,res,next)=>{
    require('../additional/actionsDB').editUser(req.user.name, req.body.email, req.body.age)
    res.redirect('/profile');
})

router.get('/show', mustAuth, (req,res)=> {
        if (req.user.isAdmin) {
            findAll()
                .then(users => {
                    res.send(users);
                })
        }
        else
            findByUsername(req.user.name)
                .then(user => {res.send(user);})
});

router.post('/logout', (req,res,next)=>{
    require('../additional/login_logout').logout(req,res,next);
})

//Tasks for lab 5

router.get('/lab5', mustAuth, (req,res,next)=>{
    findByUsername(req.user.name)
        .then(user =>{
            if (user)
                res.json('Username: ' + user.name +
                    ' Email ' + user.email +
                    ' Age: '+ user.age +
                    ' Is admin: ' + user.isAdmin +
                    ' Password: ' + user.password)
            }
        )
        .catch(err=>{res.json('Error: ' + err.message);})
});

router.post('/lab5', (req,res,next)=>{
    let username = req.query.username;
    let password = req.query.password;
    if (username && password){
        findByUsername(username)
            .then(user=>{
                if (user) res.json('This user exist');
                else{
                    createUser(username, password);
                    res.json('User created: ' + username);
                }
            })
            .catch(err => {
                res.json('Error: ' + err.message);
            })
    }
    else res.json('You need to set username and password in query parametrs');
})

router.put('/lab5', mustAuth, (req, res,next)=>{
    let email = req.query.email;
    let age = req.query.age;

    if (email && age){
        editUser(req.user.name, email,age)
            .then(user => res.json('Editions successfully aplied to ' + req.user.name))
            .catch(err => res.json('Error: ' + err.message))
    }
    else res.json("You need to set email and age in query")
})

router.delete('/lab5', (req,res,next)=>{
   // if (req.user.isAdmin) {
        let username = req.query.username;
        findByUsername(username)
            .then(user=>{
                if (user){
                    deleteUser(username)
                        .then(user => {res.json(`User ${username} was successfully deleted`)})
                        .catch(err => {res.json('Error: ' + err.message)})
                }
                else res.json('This user does not exist');
            })
            .catch(err => {res.json('Error: ' + err.message)})
   // }
    //else res.json('You are not admin');
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