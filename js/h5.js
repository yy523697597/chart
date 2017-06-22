//H5全局对象
var H5 = function () {
	this.id = ('h5_' + Math.random()).replace('.', '_');
	this.el = $('<div id="' + this.id + '" class="h5"></div>').hide();
	$('body').append(this.el);
	this.pages = [];
	//name 是用于添加样式
	//text 用于测试是否已经添加节点
	this.addPage = function (name, text) {
		var page = $('<div class="h5-page section"></div');
		if (name != undefined) {
			page.addClass('h5-page-' + name);
		}
		if (text != undefined) {
			page.text(text);
		}
		//创建了page之后必须添加到el中去，才能显示
		this.el.append(page);
		this.pages.push(page);

		// 每次在添加页面的时候都自动添加footer
		if (typeof this.whenAddPage === 'function') {
			this.whenAddPage();
		}
		return this;
	};
	this.addComponent = function (name, cfg) {
		cfg = cfg || {};
		if (!cfg.type) {
			cfg = $.extend({
				type: 'base'
			}, cfg);
		}
		//获取要添加组件的页面
		var nowPage = this.pages.slice(-1)[0];
		var component;
		switch (cfg.type) {
			case 'base':
				var component = new H5ComponentBase(name, cfg)
				break;
			case 'polyline':
				var component = new H5ComponentPolyline(name, cfg)
				break;
			default:
				return this;
		}
		//将创建的组件添加到页面中
		nowPage.append(component);
		return this;
	}
	this.loader = function () {
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
};