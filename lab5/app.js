const express = require('express');
const db = require('./additional/database').db

//test connection to db
db.authenticate()
    .then(()=> console.log('Database connected'))
    .catch(err => console.log('Error ', err.message))

//initializing app
const app = express();
const PORT = 3000;

//initializing handlebars
const hbs = require('hbs')
app.set('view engine', hbs);
hbs.registerPartials(__dirname + '/views/partials');

//settings of authorization
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
require('./additional/authentication')
app.use(session({
    secret: "SECRET", //hash the session
    saveUninitialized: true,
    resave: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

//routes
app.use('/', require('./routes/index'));

//launch server
const server = app.listen(PORT, (error) => {
    if (error) {
        return console.log(`Error: ${error}`);
    }
    console.log(`Server listening on port ${server.address().port}`);
});