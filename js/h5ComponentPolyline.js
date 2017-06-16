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

	var stepy = 10;
	// 开始画线
	ctx.beginPath();
	// 线宽
	ctx.lineWidth = 1;
	// 线的颜色
	ctx.strokeStyle = '#f00';
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
		var x = (w / stepx) * j;
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);
	}
	ctx.stroke();
	component.append(cns);
	return component;
};