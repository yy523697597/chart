/*
 * @Author: yuyi 
 * @Date: 2017-06-20 09:49:13 
 * @Last Modified by: yuyi
 * @Last Modified time: 2017-06-24 17:11:49
 */
//雷达图组件对象
var H5ComponentRadar = function (name, cfg) {
    var component = new H5ComponentBase(name, cfg);
    // 添加背景层画布
    var w = cfg.width;
    var h = cfg.height;
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    // 在此将画布大小设置为给定大小，然后再CSS中设置画布大小为原来的1/4
    // 为的是在高清屏幕下也有好的显示效果
    cns.height = ctx.height = h;
    cns.width = ctx.width = w;
    component.append(cns);

    // 画背景图层
    var r = w / 2;
    var step = cfg.data.length;

    var isBlue = true;
    for (var j = 10; j > 0; j--) {
        // 确定x、y的公式
        // 弧度：rad = (2 * Math.PI / 360) * (360 / step);
        // x = a + Math.sin(rad) * r;
        // y = b + Math.cos(rad) * r;
        ctx.beginPath();
        for (var i = 0; i < step; i++) {
            var rad = (2 * Math.PI / 360) * (360 / step) * i;
            // 分十份去绘制整个背景图层
            var x = r + Math.sin(rad) * r * (j / 10);
            var y = r + Math.cos(rad) * r * (j / 10);

            // 绘制多边形轮廓
            ctx.lineTo(x, y);
            // 交替填充背景颜色
            ctx.fillStyle = (isBlue = !isBlue) ? '#99B8FB' : '#ECF6FD';
            ctx.fill();
        }
        // 闭合多边形轮廓
        ctx.closePath();
        ctx.strokeStyle = '#cecece';
        ctx.stroke();
    }

    // 绘制多边形骨架
    ctx.beginPath();
    for (i = 0; i < step; i++) {
        rad = (2 * Math.PI / 360) * (360 / step) * i;
        x = r + Math.sin(rad) * r;
        y = r + Math.cos(rad) * r;
        // 绘制骨架，即圆心到多边形顶点的连线
        ctx.moveTo(r, r);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#cecece';

        // 添加项目文字
        var text = $('<div class="text"></div>');
        text.text(cfg.data[i][0]);

        // 根据项目位置来调整项目文字位置
        // 设置左右位置
        if (x > w / 2) {
            text.css('left', x / 2 + 5);
        } else {
            text.css('right', (w - x) / 2 + 5);
        }
        // 设置上下位置
        if (y > h / 2) {
            text.css('top', y / 2 + 5);
        } else {
            text.css('bottom', (h - y) / 2 + 5);
        }
        text.css('transition', '1s ' + (1.5 + i * 0.3) + 's');

        component.append(text);
    }
    ctx.stroke();


    // 添加数据层画布
    w = cfg.width;
    h = cfg.height;
    var cns2 = document.createElement('canvas');
    var ctx2 = cns2.getContext('2d');
    // 在此将画布大小设置为给定大小，然后再CSS中设置画布大小为原来的1/4
    // 为的是在高清屏幕下也有好的显示效果
    cns2.height = ctx2.height = h;
    cns2.width = ctx2.width = w;
    component.append(cns2);

    // 绘制数据层
    function draw(per) {
        // 当进出场动画完成之后再出现文字动画
        if (per >= 1) {
            component.find('.text').css('opacity', 1);
        } else {
            component.find('.text').css('opacity', 0);
        }
        // 每次绘制之前都需要清除上一次绘制的画布
        ctx2.clearRect(0, 0, w, h);
        ctx2.beginPath();

        // 根据per绘制不同大小的多边形，结合起来形成放大动画
        for (var i = 0; i < step; i++) {
            var s = cfg.data[i][1] * per;
            var rad = (2 * Math.PI / 360) * (360 / step) * i;
            var x = r + Math.sin(rad) * r * s;
            var y = r + Math.cos(rad) * r * s;
            // 绘制数据层多边形轮廓
            ctx2.lineTo(x, y);
            // 设置数据层轮廓的线宽与颜色
            ctx2.lineWidth = 3;
            ctx2.strokeStyle = '#FD5B78';
        }

        // 闭合多边形轮廓
        ctx2.closePath();
        ctx2.stroke();
    }

    // 触发进场动画
    component.on('onLoad', function () {
        // 通过不断增大系数per，来获得数据层放大的动画
        // 循环100次，此时per=1，动画结束
        var per = 0;
        for (var k = 0; k < 30; k++) {
            setTimeout(function () {
                per += 0.03;
                draw(per);
            }, k * 30 + 600);
        }
    });

    // 触发出场动画
    component.on('onLeave', function () {
        var per = 1;
        for (var k = 0; k < 30; k++) {
            setTimeout(function () {
                per -= 0.03;
                draw(per)
            }, k * 30);
        }
    });

    return component;
};