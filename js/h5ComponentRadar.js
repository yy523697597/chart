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
		ctx.strokeStyle = '#cecece';
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

		// 添加项目文字
		var text = $('<div class="text"></div>');
		text.text(cfg.data[i][0]);

		// 设置项目文字位置
		if (x > w / 2) {
			text.css('left', x / 2 + 5);
		} else {
			text.css('right', (w - x) / 2 + 5);
		}
		if (y > h / 2) {
			text.css('top', y / 2 + 5);
		} else {
			text.css('bottom', (h - y) / 2 + 5);
		}
		text.css('transition', '1s ' + i * 0.3 + 's');

		component.append(text);
	}
	ctx.stroke();


	var w = cfg.width;
	var h = cfg.height;
	var cns2 = document.createElement('canvas');
	var ctx2 = cns2.getContext('2d');
	// 在此将画布大小设置为给定大小，然后再CSS中设置画布大小为原来的1/4
	// 为的是在高清屏幕下也有好的显示效果
	cns2.height = ctx2.height = h;
	cns2.width = ctx2.width = w;
	component.append(cns2);

	// 绘制数据层
	function draw(per) {
		// 当动画完成之后再出现文字
		if (per >= 1) {
			component.find('.text').css('opacity', 1);
		} else {
			component.find('.text').css('opacity', 0);
		}

		ctx2.clearRect(0, 0, w, h);
		ctx2.beginPath();
		for (var i = 0; i < step; i++) {
			var s = cfg.data[i][1] * per;
			var rad = (2 * Math.PI / 360) * (360 / step) * i;
			var x = r + Math.sin(rad) * r * s;
			var y = r + Math.cos(rad) * r * s;
			// 绘制多边形轮廓
			ctx2.lineTo(x, y);
			ctx2.strokeStyle = '#f00';
		}
		ctx2.strokeStyle = '#f00';
		// 闭合多边形轮廓
		ctx2.closePath();
		ctx2.stroke();
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