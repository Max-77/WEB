const express = require ("express");
const port = 3001;
const app =express();
const fs = require("fs");

const logFile = __dirname + '/log.txt';
const route = require("./Route.js");

const hbs = require('hbs');
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + '/views/partials');

fs.writeFileSync(logFile, '');

app.use(logRequest);

route.route(app);

app.use(logToFile);

function logRequest(req, res, next){
    console.log(req.url);
    next();
}

function logToFile(err,req,res,next){
    fs.appendFileSync(logFile, err.message);
    fs.appendFileSync(logFile, ' ' + req.method + ' ' + req.url+ '\n');
    res.render("error.hbs", {
        content: err.message
    });
}

const server = app.listen(port, (error) => {
    if (error) {
        fs.appendFileSync(logFile, "500 Internal error");
        return console.log(`Error: ${error}`);
    }
    console.log(`Server listening on port ${server.address().port}`);
});