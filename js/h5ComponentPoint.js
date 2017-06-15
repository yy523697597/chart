//散点图组件对象
var H5ComponentPoint = function(name, cfg) {
	var component = new H5ComponentBase(name, cfg);
	//第一项的占比
	var base = cfg.data[0][1];
	//输出每一个point
	$.each(cfg.data, function(index, item) {
		var point = $('<div class="point point-"' + index + '></div>');
		point.text(item);
		//以第一项为基准来计算每一项的宽高比例
		var per = (item[1] / base * 100) + '%';
		point.width(per).height(per);
		//如果设定了颜色就应用颜色
		if (item[2]) {
			point.css('background-color', item[2]);
		}
		component.append(point);
	});
	return component;
};