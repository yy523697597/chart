var H5Loading = function (images) {

	var id = this.id;
	if (this._imagesCount === undefined) {
		// 第一次进入
		this._imagesCount = (images || []).length;
		this.loadedCount = 0;
		// debugger
		// 将创建的H5对象存储在全局windows对象中
		window[id] = this;

		for (var i = 0; i < this._imagesCount; i++) {

			var src = images[i];
			var img = new Image;
			img.onload = function () {
				window[id].loader();
			}
			img.src = src;
		}
		return this;
	} else {
		// 如果不是第一次进入，每加载完一次，已加载数量就加1
		// 同时更新进度条
		this.loadedCount++;
		// console.log(this.loadedCount, this._imagesCount.length);
		$('#rate').text((this.loadedCount / this._imagesCount * 100).toFixed(0) + '%');

		if (this.loadedCount < this._imagesCount) {
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