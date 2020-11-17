const express = require('express');
const bodyParser = require('body-parser');
const db = require('./additional/database').db


//test db
db.authenticate()
    .then(()=> console.log('Database connected'))
    .catch(err => console.log('Error ', err.message))

const app = express();
const PORT = 3000;

const hbs = require('hbs')
app.set('view engine', hbs);
hbs.registerPartials(__dirname + '/views/partials');

const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
require('./authentication')
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

const server = app.listen(PORT, (error) => {
    if (error) {
        return console.log(`Error: ${error}`);
    }
    console.log(`Server listening on port ${server.address().port}`);
});