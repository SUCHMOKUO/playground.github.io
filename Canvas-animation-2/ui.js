function q(elem) {
    return document.querySelector(elem);
}

const $startBtn = q('#startBtn');
const $stopBtn = q('#stopBtn');
const $dialog = q('#dialog');
const $circleNum = q('#circleNum');
const $circleNumShow = q('#circleNum+span');
const $moveSpeed = q('#moveSpeed');
const $moveSpeedShow = q('#moveSpeed+span');
const $friction = q('#friction');
const $frictionShow = q('#friction+span');
const $energyLoss = q('#energyLoss');
const $energyLossShow = q('#energyLoss+span');
const $gravity = q('#gravity');
const $gravityShow = q('#gravity+span');
const $canvas = q('#canvas');
const ctx = $canvas.getContext('2d');

$canvas.width = innerWidth - 10;
$canvas.height = innerHeight - 10;

let circleNum = 100;            // Number of circles in the canvas
let moveSpeed = 1;              // (Int) Speed of the circles                                 
let friction = 0.003;           // Kinetic energy loss ratio because of the air friction
let energyLoss = 0.02;          // Kinetic energy loss ratio because of the impact
let gravity = 0.1;              // The dy will add 'gravity' every loop
let animateSwitch = false;      // Switch for the animation loop
const colorArr = [
    'rgb(254, 67, 101)',
    'rgb(252, 157, 154)',
    'rgb(249, 205, 173)',
    'rgb(200, 200, 169)',
    'rgb(131, 175, 155)'
];
let circles = [];


class Circle {
    constructor(x, y, r, dx, dy, color, style) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.style = style;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        (this.style === 'fill') ?
        ctx.fill() :
        ctx.stroke();
    }
    update() {
        // When dx is small enough, stop calculate
        (Math.abs(this.dx) < 0.1 || this.dx === 0) ?
        this.dx = 0 : (() => {
            // When at the edge, go back
            this.dx = (this.x + this.r) >= $canvas.width ||
                      (this.x - this.r) <= 0 ? 
                    -this.dx * (1 - friction) * (1 - energyLoss) :
                    this.dx * (1 - friction);

            this.x += this.dx;
        })();
        
        // When at the bottom, stop
        ((this.y + this.r) >= $canvas.height) &&
        // When dy is small enough, stop calculate
        (Math.abs(this.dy) < 0.1 || this.dy === 0) ?
        this.dy = 0 : (() => {
            // When at the edge, go back
            (this.y + this.r) >= $canvas.height ?
            this.dy = -this.dy * (1 - friction) * (1 - energyLoss) :
            this.dy = (this.dy + gravity) * (1 - friction);

            this.y += this.dy;
        })();
    }
}

/**
 * Generate different circles
 */
function generateCircles() {
    circles = [];
    for (let i = 0; i < circleNum; i ++) {
        let x = Math.random() * $canvas.width;
        let y = Math.random() * $canvas.height;
        const r = parseInt(20 * Math.random());
        const dx = (Math.random() - 0.5) * moveSpeed * 20;
        const dy = Math.random() * moveSpeed;
        const color = colorArr[parseInt(Math.random() * 40)];
        const style = 'fill';
    
        // If the circle is generated at the edge, make it in
        x = (x - r) < 0 ? (x + r) :
            (x + r) > $canvas.width ?
            (x - r) :
            x;
    
        y = (y - r) < 0 ? (y + r) :
            (y + r) > $canvas.height ?
            (y - r) :
            y;
    
        circles.push(new Circle(x, y, r, dx, dy, color, style));
    }
}

/**
 * Turn Number into Boolean
 */
function turn(num) {
    return num ? true : false;
}

/**
 * After animation done
 */
function done() {
    $dialog.style.display = 'block';
    $dialog.classList.remove('bounceOut');
    $dialog.classList.add('bounceIn');
    animateSwitch = false;
}

/**
 * Start button event
 */
function start() {
    if (animateSwitch) {
        return;
    }
    animateSwitch = true;
    $dialog.classList.remove('bounceIn');
    $dialog.classList.add('bounceOut');
    function handler() {
        $dialog.style.display = 'none';
        generateCircles();
        animate();
        $dialog.removeEventListener('animationend', handler);
    }
    $dialog.addEventListener('animationend', handler);
}

/**
 * Refresh control panel
 */
function refreshControlPanel() {
    $circleNumShow.innerText = $circleNum.value = circleNum;
    $moveSpeedShow.innerText = $moveSpeed.value = moveSpeed;
    $frictionShow.innerText = $friction.value = friction;
    $energyLossShow.innerText = $energyLoss.value = energyLoss;
    $gravityShow.innerText = $gravity.value = gravity;
}

/**
 * Main canvas animation function
 */

function animate() {
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    for (circle of circles) {
        circle.draw();
        circle.update();
    }
    circles.map(circle => turn(circle.dx || circle.dy)).includes(true) &&
    animateSwitch ?
    requestAnimationFrame(animate) :
    done();
}

/**
 * App part
 */
refreshControlPanel();
$startBtn.onclick = start;
$stopBtn.onclick = () => animateSwitch = false;
$circleNum.onchange = () => {
    circleNum = $circleNumShow.innerText = parseInt($circleNum.value);
}
$moveSpeed.onchange = () => {
    moveSpeed = $moveSpeedShow.innerText = parseInt($moveSpeed.value);
}
$friction.onchange = () => {
    friction = $frictionShow.innerText = parseFloat($friction.value);
}
$energyLoss.onchange = () => {
    energyLoss = $energyLossShow.innerText = parseFloat($energyLoss.value);
}
$gravity.onchange = () => {
    gravity = $gravityShow.innerText = parseFloat($gravity.value);
}