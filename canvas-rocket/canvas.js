const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let url = 'https://api.spacexdata.com/v2/rockets';


fetch(url)
    .then(res => res.json())
    .then(res => {
        startBtn(res);
    }).catch(err => {
        console.error(err)
    });

class Rocket {
    constructor(firstStageFuel, secondStageFuel) {
        this.firstStageFuel = firstStageFuel;
        this.secondStageFuel = secondStageFuel;
    };
};

function placeRockets(res) {
    let rockets = [];
    res.forEach(rocket => {
        let newRocket = new Rocket(Math.floor(rocket.first_stage.fuel_amount_tons), Math.floor(rocket.second_stage.fuel_amount_tons));
        rockets.push(newRocket);
    });
    startTimer(rockets);
    fuelBurn(rockets);
    playBackgroundAudio();
};

function displayRockets(rockets) {
    let rocketImg = document.getElementById('rocket');
    let x = window.innerWidth - 230;
    let y = window.innerHeight - 130;
    console.log(rockets);

    rockets.forEach(rocket => {
        ctx.drawImage(rocketImg, x, y);
        x -= 250;
        let flame = new Image();
        flame.src = '/assets/thrust.png';
        ctx.font = '40px serif';
        let fuel = rocket.firstStageFuel;
        ctx.fillText(fuel, x, y);
        let fuelStation = new Image();
        fuelStation.src = '/assets/fuel-station.png';

        setInterval(() => {
            x = window.innerWidth - 230;
            y -= 0.1;
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            rockets.forEach(element => {
                x -= 250;
                ctx.drawImage(flame, x + 11.5 - Math.random() * 2.3, y + 80);
                ctx.drawImage(rocketImg, x, y);
                ctx.drawImage(fuelStation, x - 40, y - 68);
                ctx.fillStyle = 'yellow';
                element.firstStageFuel > 0 ? ctx.fillText(element.firstStageFuel, x, y - 40) : ctx.fillText(element.secondStageFuel, x, y - 40);
            });

            if (y < -200) {
                y = 900;
            };
        }, -10);

    });
};

function fuelBurn(rockets) {
    rockets.forEach(element => {
        setTimeout(() => { // 4 sec delay because of the timer;
            setInterval(() => {
                element.firstStageFuel > 0 ? element.firstStageFuel-- : element.secondStageFuel--;
                if (element.secondStageFuel === 0) {
                    destroyRocket(element, rockets);
                };
            }, 1000); // <-------------------------------fuel burn seconds;
        }, 4000);
    });
};

function destroyRocket(element, rockets) {
    let index = rockets.indexOf(element);
    rockets.splice(index, 1);
    if (rockets.length === 0) {
        tryAgain();
    };
};

let backgroundAudio = new Audio();

function playBackgroundAudio() {
    setTimeout(() => {
        backgroundAudio.src = '/assets/dokanNoNaka.mp3';
        setInterval(() => {
            backgroundAudio.play();
        }, 1425);
    }, 2700);
};

function startBtn(res) {
    let startBtn = document.getElementById('start-button');
    startBtn.addEventListener('click', function () {
        placeRockets(res);
        startBtn.style.display = 'none';
    });
};

function tryAgain() {
    let successHeader = document.getElementById('success-header');
    let tryAgainBtn = document.getElementById('try-again');
    successHeader.style.display = 'block';
    tryAgainBtn.style.display = 'block';
    tryAgainBtn.addEventListener('click', reload);
    backgroundAudio.src = '';

    function reload() {
        location.reload();
    };

};

function startTimer(rockets) {
    function handleTimer() {
        if (count === 1) {
            clearInterval(timer);
            displayRockets(rockets);
        } else {
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            count--;
            ctx.font = '300px Verdana';
            ctx.fillStyle = '#95afd4';
            ctx.fillText(count, innerWidth / 2.4, innerHeight / 1.7);
        }
    };
    setTimeout(() => {
        let audio = new Audio();
        audio.src = '/assets/countdown.mp3';
        audio.play();
    }, 1000);

    let count = 4;
    let timer = setInterval(() => {
        handleTimer(count)
    }, 1000);
};