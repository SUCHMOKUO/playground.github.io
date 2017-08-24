'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function q(elem) {
    return document.querySelector(elem);
}

var $startBtn = q('#startBtn');
var $stopBtn = q('#stopBtn');
var $dialog = q('#dialog');
var $circleNum = q('#circleNum');
var $circleNumShow = q('#circleNum+span');
var $moveSpeed = q('#moveSpeed');
var $moveSpeedShow = q('#moveSpeed+span');
var $friction = q('#friction');
var $frictionShow = q('#friction+span');
var $energyLoss = q('#energyLoss');
var $energyLossShow = q('#energyLoss+span');
var $gravity = q('#gravity');
var $gravityShow = q('#gravity+span');
var $canvas = q('#canvas');
var ctx = $canvas.getContext('2d');

$canvas.width = innerWidth - 10;
$canvas.height = innerHeight - 10;

var circleNum = 100; // Number of circles in the canvas
var moveSpeed = 1; // (Int) Speed of the circles                                 
var friction = 0.003; // Kinetic energy loss ratio because of the air friction
var energyLoss = 0.02; // Kinetic energy loss ratio because of the impact
var gravity = 0.1; // The dy will add 'gravity' every loop
var animateSwitch = false; // Switch for the animation loop
var colorArr = ['rgb(254, 67, 101)', 'rgb(252, 157, 154)', 'rgb(249, 205, 173)', 'rgb(200, 200, 169)', 'rgb(131, 175, 155)'];
var circles = [];

var Circle = function () {
    function Circle(x, y, r, dx, dy, color, style) {
        _classCallCheck(this, Circle);

        this.x = x;
        this.y = y;
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
        this.style = style;
    }

    _createClass(Circle, [{
        key: 'draw',
        value: function draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
            ctx.strokeStyle = this.color;
            ctx.fillStyle = this.color;
            this.style === 'fill' ? ctx.fill() : ctx.stroke();
        }
    }, {
        key: 'update',
        value: function update() {
            var _this = this;

            // When dx is small enough, stop calculate
            Math.abs(this.dx) < 0.1 || this.dx === 0 ? this.dx = 0 : function () {
                // When at the edge, go back
                _this.dx = _this.x + _this.r >= $canvas.width || _this.x - _this.r <= 0 ? -_this.dx * (1 - friction) * (1 - energyLoss) : _this.dx * (1 - friction);

                _this.x += _this.dx;
            }();

            // When at the bottom, stop
            this.y + this.r >= $canvas.height && (
            // When dy is small enough, stop calculate
            Math.abs(this.dy) < 0.1 || this.dy === 0) ? this.dy = 0 : function () {
                // When at the edge, go back
                _this.y + _this.r >= $canvas.height ? _this.dy = -_this.dy * (1 - friction) * (1 - energyLoss) : _this.dy = (_this.dy + gravity) * (1 - friction);

                _this.y += _this.dy;
            }();
        }
    }]);

    return Circle;
}();

/**
 * Generate different circles
 */


function generateCircles() {
    circles = [];
    for (var i = 0; i < circleNum; i++) {
        var x = Math.random() * $canvas.width;
        var y = Math.random() * $canvas.height;
        var r = parseInt(20 * Math.random());
        var dx = (Math.random() - 0.5) * moveSpeed * 20;
        var dy = Math.random() * moveSpeed;
        var color = colorArr[parseInt(Math.random() * 40)];
        var style = 'fill';

        // If the circle is generated at the edge, make it in
        x = x - r < 0 ? x + r : x + r > $canvas.width ? x - r : x;

        y = y - r < 0 ? y + r : y + r > $canvas.height ? y - r : y;

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
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = circles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var circle = _step.value;

            circle.draw();
            circle.update();
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    circles.map(function (circle) {
        return turn(circle.dx || circle.dy);
    }).includes(true) && animateSwitch ? requestAnimationFrame(animate) : done();
}

/**
 * App part
 */
refreshControlPanel();
$startBtn.onclick = start;
$stopBtn.onclick = function () {
    return animateSwitch = false;
};
$circleNum.onchange = function () {
    circleNum = $circleNumShow.innerText = parseInt($circleNum.value);
};
$moveSpeed.onchange = function () {
    moveSpeed = $moveSpeedShow.innerText = parseInt($moveSpeed.value);
};
$friction.onchange = function () {
    friction = $frictionShow.innerText = parseFloat($friction.value);
};
$energyLoss.onchange = function () {
    energyLoss = $energyLossShow.innerText = parseFloat($energyLoss.value);
};
$gravity.onchange = function () {
    gravity = $gravityShow.innerText = parseFloat($gravity.value);
};
