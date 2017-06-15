//基本图文组件对象
var H5ComponentBase = function(name, cfg) {
	var cfg = cfg || {};
	var id = ('h5_c_' + Math.random()).replace('.', '_');
	var cls = 'h5-component-' + cfg.type + ' h5-component-name-' + name;
	var $component = $('<div class="h5-component ' + cls + '" id="' + id + '">');
	cfg.text && $component.text(cfg.text);
	cfg.width && $component.width(cfg.width / 2);
	cfg.height && $component.height(cfg.height / 2);
	cfg.css && $component.css(cfg.css);
	cfg.bg && $component.css('backgroundImage', 'url(' + cfg.bg + ')');
	if(cfg.center) {
		$component.css({
			marginLeft: (cfg.width / 4 * -1) + 'px',
			left: '50%'
		});
	}
	$component.on('onLeave', function() {
		$component.addClass('h5-component-onLeave').removeClass('h5-component-onLoad');
		cfg.animateOut && $component.animate(cfg.animateOut);
		return false;
	});
	$component.on('onLoad', function() {
		$component.addClass('h5-component-onLoad').removeClass('h5-component-onLeave');
		cfg.animateIn && $component.animate(cfg.animateIn);
		return false;
	});
	return $component;
};