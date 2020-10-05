const mainURL = "/api/PushkinMaxim/lab1/";
const functions = require(__dirname +"/Tasks 16, 3, 13");

function route(router) {

    router.get('/', function (req, res) {
        res.render("main.hbs", {
            tittle: "Главная страница",
            content: "Это лабы по основам ВEБ-программирования",
            backColor: "#ff3131"
        });
    });

    router.get(mainURL + 'inputColorData', function(req,res){
        res.render("getParams.hbs", {
            title: "Get params for generating color",
            action: mainURL+"generateColor",
            parameters: ["type"]
        });
    });

    router.get(mainURL + 'generateColor', function (req, res) {
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

    router.get(mainURL+'inputFormatData', function(req, res){
        res.render("getParams.hbs", {
            title: "Get params for formating",
            action: mainURL+"format",
            parameters: ["number", "count"]
        })
    });

    router.get(mainURL + 'format', authentication, function (req, res) {
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

    router.get(mainURL+'inputDomainData', function(req, res){
        res.render("getParams.hbs", {
            title: "Get params for checking domain",
            action: mainURL+"checkDomain",
            parameters: ["domain"]
        })
    });

    router.get(mainURL + 'checkDomain', authentication, function (req, res) {
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

    router.get('*', function (req, res, next) {
        next(new Error("404 Not found"));
    });

}

function authentication(req, res, next){
    let permission = req.query.permission;
    if (permission === undefined){
        next(new Error("401 Unauthorized"));
        return;
    }
    if (permission !== "true"){
        next(new Error("403 Permission denied"));
        return;
    }
    if (permission === "true"){
        next();
    }
}

module.exports.route = route;