var H5Loading = function (imgs) {

	var id = this.id;
	var images;
	if (images === undefined) {
		// 第一次进入
		images = (imgs || []).length;
		var loadedCount = 0;
		// debugger
		// 将创建的H5对象存储在全局windows对象中
		window[id] = this;

		console.log(images)
		for (img of imgs) {
			var item = imgs[img];
			var img = new Image;
			img.onload = function () {
				window[id].loader();
			}
			img.src = item;
		}
		return this;
	} else {
		// 如果不是第一次进入，每加载完一次，已加载数量就加1
		// 同时更新进度条
		loadedCount++;
		console.log(loadedCount, images.length);
		$('#rate').text((loadedCount / images) * 100 + '%');

		if (loadedCount < images) {
			return this;
		}
	}
	window[id] = null;
	this.el.fullpage({
		onLeave: function () {
			this.find('.h5-component').trigger('onLeave')
		},
		afterLoad: function () {
			this.find('.h5-component').trigger('onLoad')
		}
	});
	this.el.show();
};