/*
 * @Author: yuyi 
 * @Date: 2017-06-20 14:53:51 
 * @Last Modified by: yuyi
 * @Last Modified time: 2017-06-24 17:11:12
 */

// 饼图组件对象
var H5ComponentPie = function (name, cfg) {
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
    $(cns).css('z-index', 1);
    component.append(cns);

    var r = w / 2;

    // 添加数据层画布
    var cns2 = document.createElement('canvas');
    var ctx2 = cns2.getContext('2d');
    // 在此将画布大小设置为给定大小，然后再CSS中设置画布大小为原来的1/4
    // 为的是在高清屏幕下也有好的显示效果
    cns2.height = ctx2.height = h;
    cns2.width = ctx2.width = w;
    $(cns2).css('z-index', 2);
    component.append(cns2);

    var step = cfg.data.length;
    var colors = ['#3f2860', '#90c5a9', '#7a7995', '#ef6d3b', '#fa8b60'];

    // 1.5π在0点的位置上，将此角度作为起始点比较合适
    var sAngle = 1.5 * Math.PI;
    // 360度是2π
    var aAngle = 2 * Math.PI;
    // 绘制数据层
    for (var i = 0; i < step; i++) {
        var item = cfg.data[i];
        // 通过百分比来计算应该会值得弧度
        var eAngle = sAngle + aAngle * item[1];
        // pop() 方法用于删除并返回数组的最后一个元素。
        var color = item[2] || colors.pop();
        ctx2.beginPath();
        // 每次绘制之前都应该先移动到原点
        ctx2.moveTo(r, r);
        // 每次都改变填充的颜色
        ctx2.fillStyle = color;
        ctx2.strokeStyle = color;
        // 绘制圆弧和填充颜色，注意这里应该是ctx2而不是ctx
        ctx2.arc(r, r, r, sAngle, eAngle);
        ctx2.fill();
        // 将上一次的结束角度作为下一次的开始角度
        sAngle = eAngle;
        // ctx2.stroke();

        var text = $('<div class="text"></div>');
        text.text(item[0]);
        var per = $('<div class="per"></div>');
        per.text((item[1] * 100) + '%');
        text.append(per);

        var x = r + Math.sin(0.5 * Math.PI - sAngle) * r;
        var y = r + Math.cos(0.5 * Math.PI - sAngle) * r;

        if (x > w / 2) {
            text.css('left', x / 2);
        } else {
            text.css('right', (w - x) / 2);
        }
        if (y > w / 2) {
            text.css('top', y / 2);
        } else {
            text.css('bottom', (h - y) / 2);
        }

        text.css('color', color);
        var props = 'all 1s ' + (1.5 + 0.3 * i) + 's';
        text.css('transition', props);
        component.append(text);
    }

    // 添加遮罩层画布
    var cns3 = document.createElement('canvas');
    var ctx3 = cns3.getContext('2d');
    // 在此将画布大小设置为给定大小，然后再CSS中设置画布大小为原来的1/4
    // 为的是在高清屏幕下也有好的显示效果
    cns3.height = ctx3.height = h;
    cns3.width = ctx3.width = w;
    $(cns3).css('z-index', 3);
    component.append(cns3);

    // 预先绘制一层蒙版图层来挡住数据层，避免数据层在页面刚载入的时候就显示出来
    ctx3.beginPath();
    ctx3.moveTo(r, r);
    ctx3.fillStyle = '#eee';
    ctx3.arc(r, r, r, 0, 2 * Math.PI);
    ctx3.fill();

    // 绘制动画
    function draw(per) {
        ctx3.clearRect(0, 0, w, h);
        // 绘制遮罩层
        ctx3.beginPath();
        ctx3.moveTo(r, r);
        ctx3.fillStyle = '#eee';
        if (per <= 0) {
            ctx3.arc(r, r, r, 0, 2 * Math.PI * per, false);
            component.find('.text').css('opacity', 0);
        } else {
            ctx3.arc(r, r, r, 1.5 * Math.PI, 1.5 * Math.PI + 2 * Math.PI * per, true);
        }
        if (per >= 1) {
            // 在重排文本之前，先将过渡时间改为0,不然会卡死浏览器
            // // 完成文字重排之后再将过度时间改为正常
            // component.find('.text').css('transition', 'all 0s');
            // H5ComponentPie.reSort(component.find('.text'));
            // component.find('.text').css('transition', 'all 1.5s');
            component.find('.text').css('opacity', 1);
            ctx.clearRect(0, 0, w, h);
        }
        ctx3.fill();
    }
    // 触发进场动画
    component.on('onLoad', function () {
        // 通过不断增大系数per，来获得数据层放大的动画
        // 循环100次，此时per=1，动画结束
        var per = 0;
        for (var k = 0; k < 25; k++) {
            setTimeout(function () {
                per += 0.04;
                draw(per);
            }, k * 40 + 600);
        }
    });

    // 触发出场动画
    component.on('onLeave', function () {
        var per = 1;
        for (var k = 0; k < 25; k++) {
            setTimeout(function () {
                per -= 0.40;
                draw(per);
            }, k * 40);
        }
    });

    return component;
};

H5ComponentPie.reSort = function (list) {
    var detection = function (a, b) {
        // 这里是offset()，而不是offset
        var offsetA = $(a).offset();
        var offsetB = $(b).offset();

        var shadowA_x = [offsetA.left, offsetA.left + $(a).width()];
        var shadowB_x = [offsetB.left, offsetB.left + $(b).width()];

        var shadowA_y = [offsetA.top, offsetA.top + $(a).height()];
        var shadowB_y = [offsetB.top, offsetB.top + $(b).height()];

        // 监测x轴是否相交
        var monitor_x = (shadowA_x[0] > shadowB_x[0] && shadowA_x[0] < shadowB_x[1]) || (shadowA_x[1] > shadowB_x[0] && shadowA_x[1] < shadowB_x[1]);
        // 监测y轴是否相交
        var monitor_y = (shadowA_y[0] > shadowB_y[0] && shadowA_y[0] < shadowB_y[1]) || (shadowA_y[1] > shadowB_y[0] && shadowA_y[1] < shadowB_y[1]);

        return monitor_x && monitor_y;
    };

    var composeType = function (a, b) {
        if ($(a).css('bottom') !== 'auto') {
            $(a).css('bottom', parseInt($(a).css('bottom')) + $(b).height());
        }

        if ($(a).css('top') !== 'auto') {
            $(a).css('top', parseInt($(a).css('top')) + $(b).height());
        }
    };

    var willRest = [list[0]];
    $.each(list, function (i, domTarget) {
        if (detection(willRest[willRest.length - 1], domTarget)) {
            willRest.push(domTarget);
        }
        if (willRest.length > 1) {

            $.each(willRest, function (i, domA) {
                if (willRest[i + 1]) {
                    composeType(domA, willRest[i + 1]);
                }
            });
            H5ComponentPie.reSort(willRest);
        }
    });
};