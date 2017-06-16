//散点图组件对象
var H5ComponentBar = function (name, cfg) {
	var component = new H5ComponentBase(name, cfg);
	$.each(cfg.data, function (index, item) {
		console.log(item)
		var line = $('<div class = "line"></div>');
		var name = $('<div class = "name">' + item[0] + '</div>');
		var rate = $('<div class ="rate">' + item[1] + '</div>');
		var bg = $('<div class="bg"></div>');
		var per = $('<div class ="per">' + (item[1] * 100) + '%</div>');
		bg.css('background-color', item[2]);
		// 根据不同的比例去设定rate的宽度
		rate.css('width', item[1] * 100 + '%');
		rate.append(bg);
		line.append(name).append(rate).append(per);
		component.append(line);
	});
	return component;
};