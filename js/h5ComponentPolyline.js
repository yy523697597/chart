//折线图件对象
var H5ComponentPolyline = function (name, cfg) {
	var component = new H5ComponentBase(name, cfg);
	var w = cfg.width;
	var h = cfg.height;
	var cns = document.createElement('canvas');
	var ctx = cns.getContext('2d');
	// 在此将画布大小设置为给定大小，然后再CSS中设置画布大小为原来的1/4
	// 为的是在高清屏幕下也有好的显示效果
	cns.height = ctx.height = h;
	cns.width = ctx.width = w;

	//开始绘制网格线--背景层
	var stepy = 10;
	// 开始画线
	ctx.beginPath();
	// 线宽
	ctx.lineWidth = 1;
	// 线的颜色
	ctx.strokeStyle = '#AAA';
	window.ctx = ctx;
	// 画横线，stepy应该加一，这样才能封闭图形
	for (var i = 0; i < stepy + 1; i++) {
		var y = (h / stepy) * i;
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
	}

	// 画竖线，stepx应该加2，这样才能在中间让每一根线都代表一个项目
	var stepx = cfg.data.length;
	for (var j = 0; j < stepx + 2; j++) {
		var x = (w / (stepx + 1)) * j;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);
	}
	ctx.stroke();
	component.append(cns);

	//开始绘制折线--数据层
	var cns2 = document.createElement('canvas');
	var ctx2 = cns2.getContext('2d');
	// 在此将画布大小设置为给定大小，然后再CSS中设置画布大小为原来的1/4
	// 为的是在高清屏幕下也有好的显示效果
	cns2.height = ctx2.height = h;
	cns2.width = ctx2.width = w;
	var stepx2 = cfg.data.length;
	ctx2.beginPath();
	ctx2.lineWidth = 3;
	//折线颜色
	ctx2.strokeStyle = '#ff8878';
	cfg.data.forEach(function (val, index) {
		var x = w / (stepx2 + 1) * (index + 1);
		var y = h * (1 - val[1]);
		ctx2.moveTo(x, y);
		//画点
		ctx2.arc(x, y, 5, 0, Math.PI * 2, false);
		//文字样式
		ctx2.fillStyle = val[2] ? val[2] : '#333';
		//添加文字
		ctx2.fillText((val[1] * 100) + '%', x - 10, y - 20);
	});

	//画折线,先移动到第一个点
	ctx2.moveTo(w / (stepx2 + 1), h * (1 - cfg.data[0][1]));
	cfg.data.forEach(function (val, index) {
		x = w / (stepx2 + 1) * (index + 1);
		y = h * (1 - val[1]);
		ctx2.lineTo(x, y);
		var text = $('<div class="text"></div>');
		var width = w / ((stepx2 + 1) * 2);
		text.css('width', width);
		text.css('left', width * (index + 1) - width / 2);
		text.text(val[0]);
		component.append(text);
	});
	ctx2.stroke();

	// 绘制阴影
	ctx2.lineWidth = 1;
	// 划线到最后一个点下面
	ctx2.lineTo(x, h);
	// 划线到第一个点下面
	ctx2.lineTo(w / (stepx2 + 1), h);
	ctx2.fillStyle = 'rgba(255,135,120,0.2)';
	ctx2.fill();
	ctx2.stroke();

	component.append(cns2);
	return component;
};