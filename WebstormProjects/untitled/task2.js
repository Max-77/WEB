function getRandomNumber(min, max){
    var number = Math.floor(Math.random() * (max-min+1))+min;
    if (number<10) return number;
    else switch (number) {
        case 10:
            return "A";
            break;
        case 11:
            return "B";
            break;
        case 12:
            return "C";
            break;
        case 13:
            return "D";
            break;
        case 14:
            return "E";
            break;
        case 15:
            return "F";
            break;

    }
}
function generate(){
    var color = "#";
    console.log(color);
    for (var i=0; i<6; i++){
        color += getRandomNumber(0,16)
    }
    return color;
}

console.log(generate());