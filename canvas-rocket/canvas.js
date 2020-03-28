const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


fetch('https://api.spacexdata.com/v2/rockets')
    .then(res => res.json())
    .then(res => {
        placeRockets(res)
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
};



function displayRockets(rockets) {
    let img = document.getElementById('rocket');
    let x = window.innerWidth - 230;
    let y = window.innerHeight - 130;
    console.log(rockets);

    rockets.forEach(rocket => {
        x -= 250;
        let flame = new Image();
        ctx.drawImage(img, x, y);
        flame.src = '/assets/thrust.png';
        ctx.font = '40px serif';
        let fuel = rocket.firstStageFuel;
        // fuel > 0 ? fuel = rocket.firstStageFuel : fuel = rocket.secondStageFuel;
        ctx.fillText(fuel, x, y);

        setInterval(() => {
            y -= 0.1;
            ctx.clearRect(0, 0, innerWidth, innerHeight); // <------------------ HOW ???
            ctx.drawImage(flame, x + 11.5 - Math.random() * 2.3, y + 80)
            ctx.drawImage(img, x, y);
            ctx.fillText(fuel, x, y);


            if (y < -200) {
                y = 900;
            };
        }, -10);

        setInterval(() => {
            fuel--;
        }, 1000);


    });
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
            ctx.fillStyle = '#95afd4 ';
            ctx.fillText(count, innerWidth / 2.4, innerHeight / 1.7);
        }
    };
    let count = 4;
    let timer = setInterval(() => {
        handleTimer(count)
    }, 1000);

};










// var a = 200;
// var dx = 1;
// function animate() {
//     requestAnimationFrame(animate);
//     ctx.clearRect(0, 0, innerHeight, innerWidth);

//     ctx.beginPath();
//     ctx.arc(a, 200, 30, 0, Math.PI * 2, false);
//     ctx.strokeStyle = 'red';
//     ctx.stroke();

//     a += 1;
// }
// animate();