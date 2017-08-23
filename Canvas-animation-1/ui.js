const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth - 10;
canvas.height = innerHeight - 10;

function doNoting() {};     // Placeholder function

const mouse = {             // Mouse position now
    x: undefined,
    y: undefined
};

const maxR = 80;            // Max radius of the circles                            (px)
const minR = 20;            // Min radius of the circles                            (px)
const circleNum = 100;      // Number of circles in the canvas
const moveSpeed = 1;        // Speed of the circles                                 (Int)
const incSpeed = 4;         // Increasement of the circles'radius everytime         (px)
const range = 50;           // Mouse area size                                      (px)
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
        (Math.abs(mouse.x - this.x) < range) &&
        (Math.abs(mouse.y - this.y) < range) ?
        (this.r < maxR) ? this.r += incSpeed : doNoting() :     // When in the mouse area, judge and increase radius
        (this.r > minR) ? this.r -= incSpeed : doNoting();      // When out of the mouse area, judge and decrease the radius

        // When at the edge, go back
        this.dx = (this.x + this.r) >= canvas.width ||
                  (this.x - this.r) <= 0 ? 
                  -this.dx :
                  this.dx;
        // When at the edge, go back
        this.dy = (this.y + this.r) >= canvas.height ||
                  (this.y - this.r) <= 0 ?
                  -this.dy :
                  this.dy;

        this.x += this.dx;
        this.y += this.dy;
    }
}

/**
 * Generate different circles
 */
for (let i = 0; i < circleNum; i ++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    const r = parseInt(minR * Math.random());
    const dx = (Math.random() - 0.5) * moveSpeed;
    const dy = (Math.random() - 0.5) * moveSpeed;
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

window.addEventListener('mousemove', event => {
    mouse.x = event.x;
    mouse.y = event.y;
});