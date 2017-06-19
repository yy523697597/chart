//折线图件对象
var H5ComponentRadar = function (name, cfg) {
	var component = new H5ComponentBase(name, cfg);
	var w = cfg.width;
	var h = cfg.height;
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	// 在此将画布大小设置为给定大小，然后再CSS中设置画布大小为原来的1/4
	// 为的是在高清屏幕下也有好的显示效果
	cns.height = ctx.height = h;
	cns.width = ctx.width = w;
	component.append(cns);

	// 画背景图层
	var r = w / 2;
	var step = cfg.data.length;

	var isBlue = true;
	for (var j = 10; j > 0; j--) {
		// rad = (2 * Math.PI / 360) * (360 / step);
		// x = a + Math.sin(rad) * r;
		// y = b + Math.cos(rad) * r;
		ctx.beginPath();
		for (var i = 0; i < step; i++) {
			var rad = (2 * Math.PI / 360) * (360 / step) * i;
			var x = r + Math.sin(rad) * r * (j / 10);
			var y = r + Math.cos(rad) * r * (j / 10);

			// 绘制多边形轮廓
			ctx.lineTo(x, y);
			// 填充颜色
			ctx.fillStyle = (isBlue = !isBlue) ? '#99B8FB' : '#ECF6FD';
			ctx.fill();
		}
		// 闭合多边形轮廓
		ctx.closePath();
		ctx.stroke();
	}

	// 绘制多边形骨架
	ctx.beginPath();
	for (var i = 0; i < step; i++) {
		var rad = (2 * Math.PI / 360) * (360 / step) * i;
		var x = r + Math.sin(rad) * r;
		var y = r + Math.cos(rad) * r;
		// 绘制骨架
		ctx.moveTo(r, r);
		ctx.lineTo(x, y);
		ctx.strokeStyle = '#cecece';
	}
	ctx.stroke();


	function draw() {

	}


	component.on('onLoad', function () {
		var per = 0;
		for (var k = 0; k < 100; k++) {
			setTimeout(function () {
				per += 0.01;
				draw(per)
			}, k * 10 + 600);
		}
	});

	component.on('onLeave', function () {
		var per = 1;
		for (var k = 0; k < 100; k++) {
			setTimeout(function () {
				per -= 0.01;
				draw(per)
			}, k * 10);
		}
	});

	return component;
};