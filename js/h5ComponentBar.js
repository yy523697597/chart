//散点图组件对象
var H5ComponentBar = function (name, cfg) {
	var component = new H5ComponentBase(name, cfg);
	$.each(cfg.data, function (index, item) {
		var line = $('<div class = "line"></div>');
		var name = $('<div class = "name">' + item[0] + '</div>');
		var rate = $('<div class ="rate"></div>');
		var bg = $('<div class="bg"></div>');
		var per = $('<div class ="per">' + (item[1] * 100) + '%</div>');
		if (item[2]) {
			bg.css('background-color', item[2]);
			per.css('color', item[2]);
			name.css('color', item[2]);
		}
		// 根据不同的比例去设定rate的宽度或高度
		if (cfg.type === 'bar') {
			rate.css('width', item[1] * 100 + '%');
		} else if (cfg.type === 'bar-v') {
			rate.css('height', item[1] * 100 + '%');
		}
		rate.append(bg);
		if (cfg.type === 'bar') {
			line.append(name).append(rate).append(per);
		} else if (cfg.type === 'bar-v') {
			line.append(per).append(rate).append(name);
		}

		component.append(line);
	});
	component.on('onLoad', function () {
		if (cfg.type === 'bar') {
			component.addClass('h5-component-bar-onload').removeClass('h5-component-bar-onleave');

		} else if (cfg.type === 'bar-v') {
			component.addClass('h5-component-bar-v-onload').removeClass('h5-component-bar-v-onleave');
		}
	});
	component.on('onLeave', function () {
		if (cfg.type === 'bar') {
			component.addClass('h5-component-bar-onleave').removeClass('h5-component-bar-onload');
		} else if (cfg.type === 'bar-v') {
			component.addClass('h5-component-bar-v-onleave').removeClass('h5-component-bar-v-onload');
		}
	});
	return component;
};