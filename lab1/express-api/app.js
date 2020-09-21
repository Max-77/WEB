const express = require ("express");
const port = 3000;
const app =express();

const mainURL = "/api/PushkinMaxim/lab1/";
const functions = require("./Tasks 16, 3, 13");

app.get('/', function(request, response){
    console.log(`URL: ${request.url}`);
    response.send('<h1>' + 'Hello, there is a hint for you' + '</h1><br>' +
        '<h2>' + 'Use ' + '<i>' + mainURL + 'function?key=value[&key2=value2]' + '</i></h2><br>' +
        'ex.3 Use ' + '<i><b>' + mainURL + 'generateColor?type=hex' + '</b></i><br>' +
        '<p>' + 'Generates random color in HEX, example: #123456' + '</p><br><br>' +
        'ex. 13 Use ' + '<i><b>' + mainURL + 'format?number=n&count=c' + '</b></i><br>' +
        '<p>' + 'Formatting number to count letters after point' + '</p><br><br>' +
        'ex. 16 Use ' + '<i><b>' + mainURL + 'checkDomain?domain=url' + '</b></i><br>' +
        '<p>' + 'Checks could string be a domain or not' + '</p>');
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
    response.send(number + ' formated to ' + count + ' signs after point is: ' +
    functions.format(number, count));


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
