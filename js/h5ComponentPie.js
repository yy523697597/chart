/*
 * @Author: yuyi 
 * @Date: 2017-06-20 14:53:51 
 * @Last Modified by: yuyi
 * @Last Modified time: 2017-06-20 15:36:51
 */

//饼图组件对象
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
    // 添加一个底图层
    ctx.beginPath();
    ctx.strokeStyle = '#eee';
    ctx.fillStyle = '#eee';
    ctx.arc(r, r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();


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
    var colors = ['#81C2D6', '#8192D6', '#D9B3E6', '#DCF7A1', '#83FCD8'];

    // 1.5π在0点的位置上，将此角度作为起始点比较合适
    var sAngle = 1.5 * Math.PI;
    // 360度是2π
    var aAngle = 2 * Math.PI;
    // 绘制数据层
    function draw(per) {
        for (var i = 0; i < step; i++) {
            var item = cfg.data[i];
            // 通过百分比来计算应该会值得弧度
            var eAngle = sAngle + aAngle * item[1];
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
            ctx2.stroke();
        }
    }
    draw(1);

    // 添加遮罩层画布
    var cns3 = document.createElement('canvas');
    var ctx3 = cns3.getContext('2d');
    // 在此将画布大小设置为给定大小，然后再CSS中设置画布大小为原来的1/4
    // 为的是在高清屏幕下也有好的显示效果
    cns3.height = ctx3.height = h;
    cns3.width = ctx3.width = w;
    $(cns3).css('z-index', 3);
    component.append(cns3);
    // 绘制遮罩层
    ctx3.beginPath();
    ctx3.fillStyle = '#eee';
    ctx3.arc(r, r, r, 0, 2 * Math.PI);
    ctx3.fill();

    // 触发进场动画
    component.on('onLoad', function () {
        // 通过不断增大系数per，来获得数据层放大的动画
        // 循环100次，此时per=1，动画结束
        var per = 0;
        for (var k = 0; k < 100; k++) {
            setTimeout(function () {
                per += 0.01;
                draw(per);
            }, k * 10 + 600);
        }
    });

    // 触发出场动画
    component.on('onLeave', function () {
        var per = 1;
        for (var k = 0; k < 100; k++) {
            setTimeout(function () {
                per -= 0.01;
                draw(per)
            }, k * 10);
        }
    });

    return component;
};