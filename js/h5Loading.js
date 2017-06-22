var H5Loading = function (images) {

	var id = this.id;
	if (_images === undefined) {
		// 第一次进入
		this._images = (images || []).length;
		this._loaded = 0;
		// 将创建的H5对象存储在全局windows对象中
		window[id] = this;

		for (img of images) {
			var item = images[img];
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
		this._loaded++;
		$('#rate').text((this._loaded / this._images * 100).toFixed(0) + '%');

		if (this._loaded < this._images) {
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