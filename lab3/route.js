const { Router } = require('express');
const route = Router();
const functions = require(__dirname +"/Tasks 16, 3, 13");
const mainURL = "/api/PushkinMaxim/lab1/";
const fs = require("fs");
const logFile = __dirname + '/log.txt';
const actions = require("./actions");

fs.writeFileSync(logFile, '');

route.use(logRequest);

route.get('/', function (req, res) {
    res.render("main.hbs", {
        tittle: "Главная страница",
        content: "Это лабы по основам ВEБ-программирования",
        backColor: "#6495ed"
    });
});

route.get(mainURL + 'inputColorData', mustAuth,function(req,res){
    res.render("getParams.hbs", {
        tittle: "Get params for generating color",
        backColor: "#6495ed",
        action: mainURL+"generateColor",
        parameters: ["type"],
        mainPhrase: "Input arguments for color generation"
    });
});

route.get(mainURL + 'generateColor', mustAuth, function (req, res) {
    let type = req.query.type;
    if ((type == undefined) || (type.toLowerCase() !== 'hex')) {
        res.render("main.hbs", {
            backColor: "#ff0000",
            content: "Wrong value of parameter",
            tittle: "Error"
        });
        return;
    }
    let color = functions.generateColor();
    res.render("main.hbs", {
        tittle: "Color generation",
        content: 'Сгенерированный цвет: ' + color,
        backColor: color
    })
});

route.get(mainURL+'inputFormatData', mustAuth,function(req, res){
    res.render("getParams.hbs", {
        tittle: "Get params for formating",
        backColor: "#6495ed",
        action: mainURL+"format",
        parameters: ["number", "count"],
        mainPhrase: "Input number and count to formate"
    })
});

route.get(mainURL + 'format',mustAuth, function (req, res) {
    let number = req.query.number;
    let count = req.query.count;
    if ((number == undefined) || (count == undefined)) {
        res.render("main.hbs", {
            tittle: "Error",
            backColor: "#ff0000",
            content: "Wrong value of parameter",
        });
        return;
    }
    let answer = functions.format(number, count)
    res.render("main.hbs", {
        tittle: "Formating",
        content: `Number ${number} formated to ${count} signs after point is: ${answer}`,
        backColor: "#ff3131"
    });
});

route.get(mainURL+'inputDomainData',mustAuth ,function(req, res){
    res.render("getParams.hbs", {
        tittle: "Get params for checking domain",
        backColor: "#6495ed",
        action: mainURL+"checkDomain",
        parameters: ["domain"],
        mainPhrase: "Input URL"
    })
});

route.get(mainURL + 'checkDomain', mustAuth,function (req, res) {
    let domain = req.query.domain;
    if (domain == undefined) {
        res.render("main.hbs", {
            backColor: "#ff0000",
            content: "Wrong value of parameter",
            tittle: "Error"
        });
        return;
    }

    if (!functions.checkDomain(domain)) {
        res.render("main.hbs", {
            tittle: "Проверка домена",
            content: `${domain} Не может быть доменом`,
            backColor: "#ff3131"
        });
    } else {
        res.render("main.hbs", {
            tittle: "Проверка домена",
            content: `${domain} Mожет быть доменом`,
            backColor: "#ff3131"
        });
    }
});

route.get('/register', function(req,res,next){
    if (req.isAuthenticated()){
        res.render("main.hbs",{
            tittle: "You have been authorized yet",
            content: "You have been authorized yet",
            backColor: "#6495ed"
        });
        return;
    }
    res.render("register.hbs",{
        tittle: "Register",
        action: "/register",
        backColor: "#6495ed"
    });
});

route.post('/register', function(req,res,next){
    actions.register(req,res,next);
});

route.get('/login', function(req,res,next){
    if (req.isAuthenticated()){
        res.render("main.hbs",{
            tittle: "You have been authorized yet",
            content: "You have been authorized yet",
            backColor: "#6495ed"
        });
        return;
    }
    res.render("login.hbs",{
        tittle: "Login",
        action: "/login",
        backColor: "#6495ed"
    });
});

route.post('/login', function(req,res,next){
    actions.login(req,res,next);
})

route.post('/logout', function(req,res){
    actions.logout(req,res);
})

route.get('/profile', mustAuth, function(req,res){
    res.render("profile.hbs",{
        content: "Welcome, " + req.user.username,
        action: '/logout',
        backColor: "#6495ed",
        tittle: "Profile"
    })
});

route.get('*', function (req, res, next) {
    next(new Error("404 Not found"));
});

route.use(logToFile);

function logToFile(err,req,res,next){
    fs.appendFileSync(logFile, err.message);
    fs.appendFileSync(logFile, ' ' + req.method + ' ' + req.url+ '\n');
    res.render("error.hbs", {
        backColor: "red",
        tittle: err ,
        content: err.message
    });
}

function logRequest(req, res, next){
    console.log(req.url);
    next();
}

function mustAuth(req,res,next){
    if (req.isAuthenticated()) {
        next();
        return;
    }
    next(new Error("401 Unauthorized"));
}

module.exports = route;