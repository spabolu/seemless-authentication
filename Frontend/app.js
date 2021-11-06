
var circleRotation = [
    {transform: 'rotate(0)'},
    {transform: 'rotate(360deg)'}
];

var circleTiming = {
    duration: 8000,
    iterations: Infinity
}

function pageRedirect(){
    window.location.replace("requests.html");
}
function rotateCircle(){
    document.querySelector('.button2').style.visibility = "hidden";
    document.querySelector('.loading').textContent = "Loading...Please wait!";
    document.querySelector('.circle').animate(
        circleRotation,
        circleTiming
    )
    setTimeout("pageRedirect()", 3000);
}

