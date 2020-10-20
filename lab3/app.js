const express = require ("express");
const app = express();
const fs = require("fs");

const logFile = __dirname + '/log.txt';
const PORT = 3001;

const route = require('./route');

const hbs = require('hbs');
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + '/views/partials');

const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://student:student@weblab3.r2zjz.mongodb.net/weblab3", {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
require('./authorization');

app.use(session({
    secret: "SECRET", //hash the session
    saveUninitialized: true,
    resave: true,
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}));

app.use(route);

const server = app.listen(PORT, (error) => {
    if (error) {
        fs.appendFileSync(logFile, "500 Internal error");
        return console.log(`Error: ${error}`);
    }
    console.log(`Server listening on port ${server.address().port}`);
});