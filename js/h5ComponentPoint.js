//散点图组件对象
var H5ComponentPoint = function (name, cfg) {
	var component = new H5ComponentBase(name, cfg);
	//第一项的占比
	var base = cfg.data[0][1];
	//输出每一个point
	$.each(cfg.data, function (index, item) {
		var point = $('<div class="point point-"' + index + '></div>');
		var name = $('<div class="name">' + item[0] + '</div>');
		var per = $('<div class="per">' + item[1] + '</div>');
		name.append(per);
		point.append(name);

		//以第一项为基准来计算每一项的宽高比例
		var per = (item[1] / base * 100) + '%';
		point.width(per).height(per);

		//如果设定了背景颜色就应用
		if (item[2]) {
			point.css('background-color', item[2]);
		}
		// 如果设置了后面的项目相对于第一项的位置，就应用到point中
		if (item[3] !== undefined && item[4] !== undefined) {
			point.css({
				left: (item[3]),
				top: (item[4])
			});
		}
		var step = cfg.data.length;

		component.append(point);
	});
	return component;
};