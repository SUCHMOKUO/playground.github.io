const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth - 10;
canvas.height = innerHeight - 10;

const circleNum = 100;      // Number of circles in the canvas
const moveSpeed = 1;        // (Int) Speed of the circles                                 
const frictionX = 0.99;     // The dx will change to 'frictionX' times of it's last loop
const frictionY = 0.9;      // The dy will change to 'frictionY' times of itself every impact
const gravity = 0.1;        // The dy will add 'gravity' every loop
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
        this.dx = (Math.abs(this.dx) < 1e-4 || this.dx === 0) ?
                  0 :
                  // When at the edge, go back
                  (this.x + this.r) >= canvas.width ||
                  (this.x - this.r) <= 0 ? 
                  -this.dx * frictionX :
                  this.dx * frictionX;
        // When at the bottom, stop
        ((this.y + this.r) >= canvas.height) &&
        // When dy is small enough, stop calculate
        (Math.abs(this.dy) < 1e-4 || this.dy === 0) ?
        this.dy = 0 : (() => {
            // When at the edge, go back
            (this.y + this.r) >= canvas.height ?
            this.dy = -this.dy * frictionY :
            this.dy += gravity;

            this.x += this.dx;
            this.y += this.dy;
        })() 
    }
}

/**
 * Generate different circles
 */
for (let i = 0; i < circleNum; i ++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    const r = parseInt(20 * Math.random());
    const dx = (Math.random() - 0.5) * moveSpeed * 20;
    const dy = Math.random() * moveSpeed;
    const color = colorArr[parseInt(Math.random() * 40)];
    const style = 'fill';

    // If the circle is generated at the edge, make it in
    x = (x - r) < 0 ? (x + r) :
        (x + r) > canvas.width ?
        (x - r) :
        x;

    y = (y - r) < 0 ? (y + r) :
        (y + r) > canvas.height ?
        (y - r) :
        y;

    circles.push(new Circle(x, y, r, dx, dy, color, style));
}

/**
 * Main canvas animation function
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(circle of circles) {
        circle.draw();
        circle.update();
    }
    requestAnimationFrame(animate);
}

animate();