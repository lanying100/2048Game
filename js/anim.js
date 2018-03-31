var cell_width = 90;// 单元格宽高
var cell_space = 10;// 单元格间距（单元格与容器的间距）
var anim_duration = 200;// 动画持续时间

// 移动动画,从一个单元格移动到另一个单元格
function move_anim(fromX,fromY,toX,toY) {
    console.debug(""+fromX+" "+fromY+" "+toX+" "+toY);

    // 需要把js对象转化为jQuery对象，才能调用animate方法
    var numCell = $('#cell_'+fromX+'_'+fromY).children()[0];
    numCell.style.zIndex=1;//移动元素的视图层级最高（确保不会被遮挡）
    console.debug(numCell);
    $(numCell).animate({
        // 需要样式中设置position为相对定位,注意x\y和top\left别搞串了！！！
        top:(toX - fromX) * (cell_width+cell_space)+"px",
        left:(toY - fromY) * (cell_width+cell_space)+"px"
    },anim_duration);

}