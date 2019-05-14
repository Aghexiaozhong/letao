$(function () {
    mui('.mui-scroll-wrapper').scroll({
            //这里初始化滚动
            // deceleration:0.0005  //flick  减速系数，系数越大，滚动越慢，滚动距离越小，默认值0.0006
            indicators:false  //这个就是不显示滚动条
        }
    );
    //初始化刷新和下拉加载
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等

            down:{
                auto:true,   //1,初始化页面  自动下拉刷新
                callback:function () {

                    var that = this;
                    //将初始化后的当前对象挂在在window上
                    window.down = this;
                    setTimeout(function () {
                        //渲染页面  然后把加载状态影藏
                        getCartData(function (data) {
                            //console.log(data);
                            $('.mui-table-view').html(template('cart2',data));
                        });
                        //有的时候防止绑定多次 $('.nn').off('').on(function({})
                        that.endPulldownToRefresh();

                    },1000);

                }
            }
        }
    });


    $('.fa-refresh').on('tap',function () {
        //刷新 主动触发下拉操作  //4,点击刷新按钮，  刷新
       window.down.pulldownLoading();
       //也可以 mui('#refreshContainer').pullRefresh().pulldownLoading()

    });
    //2,侧滑的时候点击编辑弹出对话框，用来修改尺码和数量
    //如果在外面绑定编辑按钮，需要找到他的父元素，而且不是模板内的
    $('.mui-table-view').on('tap','.mui-icon-compose',function () {
        //弹框的内容 默认是字符串 可以写成html格式的字符串（能被解析）
        //confirm在使用字符串作为内容的时候,HTML会把\n  转换成换行
        //获取按钮对应商品(标志id)的数据
        //根据id缓存获取
        var id = $(this).parent().attr('data-id');
        //console.log(id);
        //遍历cartData  匹配id获取对应数据 ，而这个很多地都能用到，可以封装起来
        var item = CT.getItemById(window.cartData.data,id);
        //console.log(item);
        var html = template('edit',item);
        mui.confirm(html.replace(/\n/g,''),'编辑商品',['确认','取消'],function (e) {

            if(e.index == 0){
                //发送请求
                var size = $('.btn_size.now').html();

                var num = $('.lt_pro_Num input').val();
                CT.loginAjax({
                    url:'/cart/updateCart',
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    type:'post',
                    dataType:'json',
                    success:function (data) {
                        if(data.success == true){
                            //窗口关闭  得扥发送完ajax完毕之后再关闭弹框
                            // 更新购物车数据

                            //item和cartData 指向的是同一个对象，所以改变一个另一个也会改变
                            item.num = num;
                            item.size = size;
                            //缓存的数据cartData也随之修改
                            $('.mui-table-view').html(template('cart2',window.cartData));
                            //setMoneyTotal();
                        }
                    }
                });
                //return false
            }else{
                
            }
        });
    });
    //绑定事件，就是点击尺码或者数量加减时，得在confirm()点击确认获取取消之后并且在html()模板渲染成功之后
    //使用委托事件
    $('body').on('tap','.btn_size',function () {
        $(this).addClass('now').siblings().removeClass('now');
    });
    //数量选择
    $('body').on('tap','span',function () {
        //判断是加还是减
        var currNum = $(this).siblings('input').val();
        var maxNum = parseInt($(this).siblings('input').attr('data-max'));
        if($(this).hasClass('jian')){
            if(currNum <= 1){
                mui.toast('数量不能少于1');
                return false;
            }
            currNum --;
        }else if($(this).hasClass('jia')){
            //不能超过库存
            if(currNum >= maxNum){
                mui.toast('库存不足');
                return false;
            }
            currNum ++;
        }
        $(this).siblings('input').val(currNum);
    });



    //3,侧滑的时候点击删除弹出对话框，确认删除
    $('.mui-table-view').on('tap','.mui-icon-trash',function () {
        //这样绑定一个要使用的当前对象，因为$(this)在不同情况的当前对象不一样
        var $this = $(this);
        var id = $(this).parent().attr('data-id');
        mui.confirm('您是否删除该商品?','商品删除',['确认','取消'],function (e) {

            if(e.index == 0){
                //发送请求
                CT.loginAjax({
                    url:'/cart/deleteCart',
                    data:{
                        id:id

                    },
                    type:'get',
                    dataType:'json',
                    success:function (data) {
                        if(data.success == true){
                            //把当前商品删除
                            $this.parent().parent().remove();
                            setMoneyTotal();
                        }
                    }
                });


                //return false
            }else{

            }
        });
    });

    //5,点击复选框  计算总金额
    $('.mui-table-view').on('change','[type=checkbox]',function () {
        //总金额
        setMoneyTotal();
    });
});

var setMoneyTotal = function () {
    //拿到所有选中的checkbox
    var checkedBoxArr = $('[type=checkbox]:checked');
    //获取选中的商品的id列表

    //$.each()可遍历jq对象和数组  $dom.each()只能是jq对象  arr.forEach() 只能是数组
    var totalMoney = 0;
    checkedBoxArr.each(function (i,item) {
        var id = $(this).attr('data-id');
        var item = CT.getItemById(window.cartData.data,id);
        var num = item.num;
        var price = item.price;
        var total = num * price;
        totalMoney += total;

    });
    if(Math.floor(totalMoney * 100) % 10){
        totalMoney = Math.floor(totalMoney * 100) / 100;
    }else{
        totalMoney = Math.floor(totalMoney * 100) / 100;
        totalMoney = totalMoney.toString()+'0';
    }

    $('.lt_trade span').html(totalMoney);
};


var getCartData = function (callback) {
    //loginAjax先校验是否登录  使用封装好的函数
    CT.loginAjax({
        url:'/cart/queryCartPaging',
        type:'get',
        dataType:'json',
        data:{
            page:1,
            //不产生分页 需要修改接口
            pageSize:100

        },
        success:function (data) {
            //定义一个变量，绑定数据，保存起来，当侧滑编辑的时候把数据取出来
            window.cartData = data;
            callback && callback(data);
        }
    });
};









