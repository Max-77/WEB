const express = require ("express");
const port = 3000;
const app =express();
const style = "border: 1px solid red; padding: 0 10px";
const mainURL = "/api/PushkinMaxim/lab1/";
const functions = require("./Tasks 16, 3, 13");
// Переверстать страницу чтобы каждая надпись была в квадрате и ссылка кликабельная
app.get('/', function(request, response){
    console.log(`URL: ${request.url}`);
    response.sendFile(__dirname + "/index.html");
});

app.get(mainURL+'generateColor', function (request, response){
    console.log(`URL: ${request.url}`);
    let type = request.query.type;
     if ((type == undefined) || (type.toLowerCase() !== 'hex')) {
        response.send('Wrong value of parameter');
        return;
     }
    let color = functions.generateColor();
    let circle_ = '"width: 120px; height: 120px; background: ' + color + '"';
    response.send('Generated color: ' + color + '<div id="circle" style = '+ circle_+'>'+'</div>')
});

app.get(mainURL + 'format', function(request, response){
    console.log(`URL: ${request.url}`);
    let number = request.query.number;
    let count = request.query.count;
    if ((number == undefined) || (count == undefined)) {
        response.send('Wrong value of parameter');
        return;
    }
    response.send(number + ' formated to ' + count + ' signs after point is: ' +    functions.format(number, count));


});

app.get(mainURL + 'checkDomain', function(request, response){
    console.log(`URL: ${request.url}`);
    let domain = request.query.domain;
    if (domain == undefined){
        response.send('Wrong value of parameter');
        return;
    }

    if (!functions.checkDomain(domain))
        response.send(domain  + '<br>' + " Couldn't be a domain");
    else response.send(domain + '<br>' + " Could be a domain");
});

const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});
