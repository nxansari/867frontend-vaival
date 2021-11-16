function _interopDefault(ex) {
	return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var React = require('react');
var React__default = _interopDefault(React);

const canvasSize = 210;

var WheelComponent = function WheelComponent(_ref) {
	var segments = _ref.segments,
		onFinished = _ref.onFinished,
		primaryColor = _ref.primaryColor,
		contrastColor = _ref.contrastColor,
		backgroundColor = _ref.backgroundColor,
		glow = _ref.glow,
		spinPressed = _ref.spinPressed,
		hasSpun = _ref.hasSpun,
		buttonText = _ref.buttonText,
		winningSegment = _ref.winningSegment.toUpperCase(),
		minTime = _ref.minTime,
		_ref$isOnlyOnce = _ref.isOnlyOnce,
		isOnlyOnce = _ref$isOnlyOnce === void 0 ? true : _ref$isOnlyOnce,
		_ref$size = _ref.size,
		size = _ref$size === void 0 ? 290 : _ref$size,
		_ref$upDuration = _ref.upDuration,
		upDuration = _ref$upDuration === void 0 ? 100 : _ref$upDuration,
		_ref$downDuration = _ref.downDuration,
		downDuration = _ref$downDuration === void 0 ? 1000 : _ref$downDuration,
		setCurrentSegment = _ref.setCurrentSegment;
	var currentSegment = '';
	var isStarted = false;

	var _useState = React.useState(false),
		isFinished = _useState[0],
		setFinished = _useState[1];

	var timerHandle = 0;
	var timerDelay = segments.length;
	var angleCurrent = 0;
	var angleDelta = 0;
	var canvasContext = null;
	var globalCanvas = null;
	var maxSpeed = Math.PI / ('' + segments.length);
	var upTime = segments.length * upDuration;
	var downTime = segments.length * downDuration;
	var spinStart = 0;
	var centerX = canvasSize / 2;
	var centerY = canvasSize / 2;

	let frames = 0;

	React.useEffect(function () {
		wheelInit();
		setTimeout(function () {
			window.scrollTo(0, 1);
		}, 0);
	}, []);

	var wheelInit = function wheelInit() {
		initCanvas();
		wheelDraw();
	};

	var initCanvas = function initCanvas() {
		var canvas = document.getElementById('canvas');
		globalCanvas = canvas;

		if (navigator.appVersion.indexOf('MSIE') !== -1) {
			canvas = document.createElement('canvas');
			canvas.setAttribute('width', canvasSize);
			canvas.setAttribute('height', canvasSize);
			canvas.setAttribute('id', 'canvas');
			document.getElementById('wheel').appendChild(canvas);
		}

		//canvas.addEventListener("click", spin, false);
		canvasContext = canvas.getContext('2d');
	};

	var spin = function spin() {
		if (winningSegment == 'PLACEHOLDER') return;
		if (hasSpun) return;

		isStarted = true;

		if (timerHandle === 0 && canvasContext) {
			spinStart = new Date().getTime();
			maxSpeed = Math.PI / segments.length;
			frames = 0;
			timerHandle = setInterval(onTimerTick, timerDelay);
		}
	};

	React.useEffect(
		function () {
			if (spinPressed && !hasSpun) {
				wheelInit();
				spin();
				console.log('spin');
			}
		},
		[spinPressed]
	);

	var onTimerTick = function onTimerTick() {
		frames++;
		draw();
		var duration = new Date().getTime() - spinStart;
		var progress = 0;
		var finished = false;

		if (duration < upTime) {
			progress = duration / upTime;
			angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
		} else {
			if (currentSegment === winningSegment && frames > minTime) {
				progress = duration / upTime;
				angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
				progress = 1;
			} else {
				progress = duration / downTime;
				angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
			}
			if (progress >= 1) {
				finished = true;
			}
		}

		angleCurrent += angleDelta;

		while (angleCurrent >= Math.PI * 2) {
			angleCurrent -= Math.PI * 2;
		}

		if (finished) {
			setFinished(true);
			onFinished(currentSegment);
			clearInterval(timerHandle);
			timerHandle = 0;
			angleDelta = 0;
		}
	};

	var wheelDraw = function wheelDraw() {
		clear();
		drawWheel();
		drawNeedle();
	};

	var draw = function draw() {
		clear();
		drawWheel();
		drawNeedle();
	};

	var drawSegment = function drawSegment(key, lastAngle, angle) {
		const offset = 0; //Math.PI / 4;
		var ctx = canvasContext;
		var value = segments[key];
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, size, lastAngle - offset, angle - offset, false);
		ctx.lineTo(centerX, centerY);
		ctx.closePath();
		ctx.fillStyle = segments[key];
		ctx.shadowBlur = 5;
		ctx.shadowColor = glow;
		ctx.fill();
		ctx.strokeStyle = primaryColor;
		ctx.stroke();
		ctx.save();
		ctx.translate(centerX, centerY);
		ctx.restore();
	};

	var drawWheel = function drawWheel() {
		var ctx = canvasContext;
		var lastAngle = angleCurrent;
		var len = segments.length;
		var PI2 = Math.PI * 2;
		ctx.lineWidth = 1;
		ctx.strokeStyle = primaryColor || 'black';
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
		ctx.font = '0.8rem Scania Sans CY Headline';

		for (var i = 1; i <= len; i++) {
			var angle = PI2 * (i / len) + angleCurrent;
			drawSegment(i - 1, lastAngle, angle);
			lastAngle = angle;
		}
		const circle = new Path2D();
		ctx.beginPath();
		circle.arc(centerX, centerY, 30, 0, PI2, false);
		ctx.closePath();

		ctx.fillStyle = backgroundColor;
		ctx.lineWidth = 2;
		ctx.strokeStyle = primaryColor;
		ctx.fill(circle);

		// globalCanvas.addEventListener("click", function (event) {
		//     if (isStarted) {
		//         return;
		//     }
		//     // Check whether point is inside circle
		//     if (ctx.isPointInPath(circle, event.offsetX, event.offsetY)) {
		//         console.log("clicked");
		//         spin();
		//     }
		// });

		// ctx.font = "bold 1rem proxima-nova";
		// ctx.fillStyle = contrastColor || "white";
		// ctx.textAlign = "center";
		// ctx.fillText(buttonText || "Spin", centerX, centerY + 3);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(centerX, centerY, size, 0, PI2, false);
		ctx.closePath();
	};

	var drawNeedle = function drawNeedle() {
		var ctx = canvasContext;
		ctx.shadowBlur = 0;
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'white';
		ctx.fileStyle = contrastColor || 'white';
		ctx.beginPath();
		ctx.moveTo(centerX + 10, centerY - 28);
		ctx.lineTo(centerX - 10, centerY - 28);
		ctx.lineTo(centerX, centerY - 40);
		ctx.closePath();
		ctx.fill();
		var change = angleCurrent + Math.PI / 2;
		var i = segments.length - Math.floor((change / (Math.PI * 2)) * segments.length) - 1;
		if (i < 0) i = i + segments.length;
		currentSegment = segments[i];
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = currentSegment || 'black';
		ctx.font = 'bold 2.4rem Scania Sans CY Headline';
		ctx.shadowBlur = 4;
		ctx.shadowColor = 'white';

		setCurrentSegment(currentSegment);
		//ctx.fillText(currentSegment, centerX + size * 2, centerY);
	};

	var clear = function clear() {
		var ctx = canvasContext;
		ctx.clearRect(0, 0, canvasSize, canvasSize);
	};

	return /*#__PURE__*/ React__default.createElement(
		'div',
		{
			id: 'wheel',
		},
		/*#__PURE__*/ React__default.createElement('canvas', {
			id: 'canvas',
			width: canvasSize,
			height: canvasSize,
			style: {
				pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto',
			},
		})
	);
};

module.exports = WheelComponent;
//# sourceMappingURL=index.js.map
