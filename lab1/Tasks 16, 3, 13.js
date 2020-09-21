function generateColor(){
    let hexColor = "#";
    for (let i =0; i < 6; i++){
        hexColor += Math.floor(Math.random()*16).toString(16);
    }
    return hexColor;
}

function checkDomain(domain){
    if (typeof(domain) != "string") return false;
    if (domain.length < 2 || domain.length > 255) return false;
    let arrOfSubdomains = domain.split(".");

    for (let i = 0; i<arrOfSubdomains.length; i++){
        let tmp = arrOfSubdomains[i];
        if (tmp.length > 63 || tmp.length < 2) return false;
        let regexp_first = /^[a-z\d][a-z\d-]*[a-z\d]$/gi;
        if (!tmp.match(regexp_first)) return false;
    }
    return true;
}

function format(number, countOfSigns){
    let scale = 10**countOfSigns;
    return (Math.round(number*scale)/scale);
}

module.exports.generateColor = generateColor;
module.exports.checkDomain = checkDomain;
module.exports.format = format;