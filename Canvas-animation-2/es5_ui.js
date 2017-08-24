'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = document.querySelector('#canvas');
var ctx = canvas.getContext('2d');

canvas.width = innerWidth - 10;
canvas.height = innerHeight - 10;

var circleNum = 100; // Number of circles in the canvas
var moveSpeed = 1; // (Int) Speed of the circles                                 
var frictionX = 0.99; // The dx will change to 'frictionX' times of it's last loop
var frictionY = 0.9; // The dy will change to 'frictionY' times of itself every impact
var gravity = 0.1; // The dy will add 'gravity' every loop
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
            this.dx = Math.abs(this.dx) < 1e-4 || this.dx === 0 ? 0 :
            // When at the edge, go back
            this.x + this.r >= canvas.width || this.x - this.r <= 0 ? -this.dx * frictionX : this.dx * frictionX;
            // When at the bottom, stop
            this.y + this.r >= canvas.height && (
            // When dy is small enough, stop calculate
            Math.abs(this.dy) < 1e-4 || this.dy === 0) ? this.dy = 0 : function () {
                // When at the edge, go back
                _this.y + _this.r >= canvas.height ? _this.dy = -_this.dy * frictionY : _this.dy += gravity;

                _this.x += _this.dx;
                _this.y += _this.dy;
            }();
        }
    }]);

    return Circle;
}();

/**
 * Generate different circles
 */


for (var i = 0; i < circleNum; i++) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var r = parseInt(20 * Math.random());
    var dx = (Math.random() - 0.5) * moveSpeed * 20;
    var dy = Math.random() * moveSpeed;
    var color = colorArr[parseInt(Math.random() * 40)];
    var style = 'fill';

    // If the circle is generated at the edge, make it in
    x = x - r < 0 ? x + r : x + r > canvas.width ? x - r : x;

    y = y - r < 0 ? y + r : y + r > canvas.height ? y - r : y;

    circles.push(new Circle(x, y, r, dx, dy, color, style));
}

/**
 * Main canvas animation function
 */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    requestAnimationFrame(animate);
}

animate();
