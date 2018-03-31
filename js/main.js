var numArr = [];// 表示16个单元格中的数字
var mergeArr = [];// 表示每一次移动后，16个单元格是否合并过
var delay = 210;// 200ms动画过后，再刷新数据，否则div还没完成动画就被remove了

init();// 调用该方法，实现初始化
generate_one_number();// 生成两个随机数据
generate_one_number();

update_cell_view();// 更新界面
// 键盘事件


// 清除mergeArr二维数组
function clearMerge(){
    for(var i = 0; i < 4; i ++){
        mergeArr[i] = [];
        for(var j = 0; j < 4; j ++){
            mergeArr[i][j] = false;
        }
    }
}

// 【数据储备】初始化二维数组
function init(){
    for(var i = 0; i < 4; i ++){
        numArr[i] = [];// 二维数组
        for(var j = 0; j < 4; j ++){
            numArr[i][j] = 0;
            console.log(numArr[i][j]);
        }
    }
    clearMerge();
}

// 【界面展示】将二维数组数据呈现在网页上对应的单元格中
function update_cell_view_without_anim() {
    for(var i = 0; i < 4; i ++){
        for(var j = 0; j < 4; j ++){
            var cell = document.getElementById("cell_"+i+"_"+j);
            var num = numArr[i][j];
            cell.innerHTML = num==0?"":num;// 设置每个单元格的数字
            cell.style.fontSize="55px";
            cell.style.fontFamily="Arial";
            cell.style.textAlign="center";
            // 获取单元格的高度
            var height = window.getComputedStyle(cell).height;
            // 垂直居中
            cell.style.lineHeight=height;
        }
    }
}

// 思路：移动的不是cell而是cell里的div
function update_cell_view() {
    $('.num_cell').remove();// 删除掉上一波的数字单元格
    for(var i = 0; i < 4; i ++){
        for(var j = 0; j < 4; j ++){
            var cell = document.getElementById("cell_"+i+"_"+j);
            var num = numArr[i][j];

            // cell里的div承包了相应的数字、背景色、文字颜色
            var div = document.createElement("div");
            cell.appendChild(div);
            div.className="num_cell";// 数字单元格
            div.innerHTML = num==0?"":num;// 设置每个单元格的数字
            div.style.fontSize="55px";
            div.style.fontFamily="Arial";
            div.style.textAlign="center";
            div.style.color=get_text_color(num);
            div.style.backgroundColor=get_bg_color(num);// 根据数字大小显示不同颜色

            // 获取单元格的高度
            // $("cell_"+i+"_"+j).firstChild().addClass("cell");//　将cell的样式添加到div上
            var height = window.getComputedStyle(cell).height;
            // 垂直居中
            div.style.lineHeight=height;
            div.style.height=height;
            div.style.width=height;
            div.style.position="absolute";// 相对于cell而言
        }
    }
}

// 判断是否有空白单元格
function nospace() {
    for(var i = 0; i < 4; i ++){
        for(var j = 0; j < 4; j ++){
            if(numArr[i][j] == 0){
                return false;// 还有空白单元格
            }
        }
    }
    return true;// 没有空白单元格了
}

// 在随机位置生成随机数（2 or 4)
function generate_one_number(){
    if(nospace()){
        return false;// 没有剩余空间了，直接返回
    }

    var count = 0;// 统计随机生成失败的次数
    do{
        var randx = Math.floor(Math.random()*4);
        var randy = Math.floor(Math.random()*4);
        var positionNum = numArr[randx][randy];
        console.debug(positionNum)
        // 空白单元格，可用
        if(positionNum == 0){
            var randNum = Math.random()<0.5?2:4;
            numArr[randx][randy] = randNum;
            return true;// 生成完毕
        }
        count++;
        if(count > 50){
            break;// 查缺补漏
        }
    }while(true);

    // 遍历找空缺
    for(var i = 0; i < 4; i ++){
        for(var j = 0; j < 4; j ++){
            if(numArr[i][j] == 0){
                var randNum = Math.random()<0.5?2:4;
                numArr[randx][randy] = randNum;
                return true;// 生成完毕
            }
        }
    }
}

// 判断i行: j列到k列之间是否有其它单元格
function no_horizontal_block(i, j, k) {
    var min = j<k?j:k;
    var max = j>k?j:k;
    for(var n = min+1;n < max; n ++){
        if(numArr[i][n] != 0){
            return false;// 有阻隔
        }
    }
    return true;// 没阻隔
}

// 判断目标单元格有没有合并过
function has_merge(i,k) {
    return mergeArr[i][k];
}

// 向左移动
function move_left() {
    for(var i = 0; i < 4; i ++){
        for(var j = 0; j < 4; j ++){
            // 对于每一个有效的单元格，都需要判断
            if(numArr[i][j]!=0){
                // 判断目标单元格左侧有没有（空白+之间没有阻隔）或（相同数字+之间没有阻隔）
                for(var k = 0; k < j; k ++){
                    if(numArr[i][k]==0&&no_horizontal_block(i,k,j)&&!has_merge(i,k)){
                        numArr[i][k] = numArr[i][j];// 直接赋值
                        numArr[i][j] = 0;// 原单元格清0
                        //mergeArr[i][k] = true;// 该单元格本次操作合并过，不会发生二次合并
                        move_anim(i,j,i,k);
                        break;
                    }else if(numArr[i][k]==numArr[i][j]&&no_horizontal_block(i,k,j)&&!has_merge(i,k)){
                        numArr[i][k] += numArr[i][j];
                        numArr[i][j] = 0;// 原单元格清0
                        mergeArr[i][k] = true;// 该单元格本次操作合并过，不会发生二次合并
                        move_anim(i,j,i,k);
                        break;
                    }
                }
            }
        }
    }
}

// 向右移动
function move_right() {
    for(var i = 0; i < 4; i ++){
        // 注意j列从大到小，否则会出现只有最右侧一列移动，前面几列不动的问题
        for(var j = 3; j >= 0; j --){
            if(numArr[i][j]!=0){
                // 判断目标单元格【右】侧有没有（空白+之间没有阻隔）或（相同数字+之间没有阻隔）
                for(var k = 3; k > j; k --){
                    // 注意no_horizontal_block(i,j,k)中，j和k的位置颠倒
                    if(numArr[i][k]==0&&no_horizontal_block(i,j,k)&&!has_merge(i,k)){
                        numArr[i][k] = numArr[i][j];// 直接赋值
                        numArr[i][j] = 0;// 原单元格清0
                        //mergeArr[i][k] = true;// 该单元格本次操作合并过，不会发生二次合并
                        move_anim(i,j,i,k);
                        break;
                    }else if(numArr[i][k]==numArr[i][j]&&no_horizontal_block(i,k,j)&&!has_merge(i,k)){
                        numArr[i][k] += numArr[i][j];
                        numArr[i][j] = 0;// 原单元格清0
                        mergeArr[i][k] = true;// 该单元格本次操作合并过，不会发生二次合并
                        move_anim(i,j,i,k);
                        break;
                    }
                }
            }
        }
    }
}

// 在col列：row1行和row2行之间有没有阻隔
function no_vertical_block(row1,row2, col) {
    var min = row1<row2?row1:row2;
    var max = row1>row2?row1:row2;
    for(var n = min+1; n < max; n ++){
        if(numArr[n][col]!=0){
            return false;// 有阻隔
        }
    }
    return true;// 没有阻隔 为真
}

// 向上移动
function move_top() {
    for(var i = 0; i < 4; i ++){// 行标
        for(var j = 0; j < 4; j ++){// 列标
            // 摘出每个有效单元格
            if(numArr[i][j]!=0){
                // 判断目标单元格【上】方有没有（空白+之间没有阻隔）或（相同数字+之间没有阻隔）
                // k现在是【行】标
                for(var k = 0; k < i; k ++){
                    // 注意是no_vertical_block(i,j,k)
                    if(numArr[k][j]==0&&no_vertical_block(k,i,j)&&!has_merge(k,j)){
                        numArr[k][j] = numArr[i][j];
                        numArr[i][j] = 0;
                        //mergeArr[k][j] = true;
                        move_anim(i,j,k,j);
                        break;
                    }else if(numArr[k][j]==numArr[i][j]&&no_vertical_block(k,i,j)&&!has_merge(k,j)){
                        numArr[k][j] += numArr[i][j];
                        numArr[i][j] = 0;// 原单元格清0
                        mergeArr[k][j] = true;// 该单元格本次操作合并过，不会发生二次合并
                        move_anim(i,j,k,j);
                        break;
                    }
                }
            }
        }
    }
}

// 向下移动
function move_bottom() {
    // 注意行标i从大到小
    for(var i = 3; i >= 0; i --){// 行标
        for(var j = 0; j < 4; j ++){// 列标
            // 摘出每个有效单元格
            if(numArr[i][j]!=0){
                // 判断目标单元格【下】方有没有（空白+之间没有阻隔）或（相同数字+之间没有阻隔）
                // k现在是【行】标
                for(var k = 3; k > i; k --){
                    // 注意是no_vertical_block(i,j,k)
                    if(numArr[k][j]==0&&no_vertical_block(i,k,j)&&!has_merge(k,j)){
                        numArr[k][j] = numArr[i][j];
                        numArr[i][j] = 0;
                        //mergeArr[k][j] = true;
                        move_anim(i,j,k,j);
                        break;
                    }else if(numArr[k][j]==numArr[i][j]&&no_vertical_block(i,k,j)&&!has_merge(k,j)){
                        numArr[k][j] += numArr[i][j];
                        numArr[i][j] = 0;// 原单元格清0
                        mergeArr[k][j] = true;// 该单元格本次操作合并过，不会发生二次合并
                        move_anim(i,j,k,j);
                        break;
                    }
                }
            }
        }
    }
}

// 设置“键盘事件”监听
document.onkeydown=function (ev) {
    // left-37  top-38  right-39  bottom-40
    //console.log(ev.keyCode);
    switch(ev.keyCode){
        case 37:// left
            move_left();
            break;
        case 38:// top
            move_top();
            break;
        case 39:// right
            move_right();
            break;
        case 40:// bottom
            move_bottom();
            break;
        //default :// 什么都不用干
    }

    clearMerge();// 每一次操作之后，都需要清除所有的标记，否则会影响后面的移动

    // 生成两个随机数据
    generate_one_number();
    generate_one_number();

    setTimeout('update_cell_view()',delay);// 每次移动之后，停顿一下再显示新生成的数据。调用方法时要加引号啊！！！
};