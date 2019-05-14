$(function () {
    //productId  通过地址栏获取  (就是CT是，之前定义的全局函数)
    var id = CT.getParamsByurl().productId;
    getProductData(id,function (data) {
    //清楚加载状态  删掉那张图片
        $('.mui-icon-spinner').remove();
        //渲染商品详情页
        console.log(data);
        $('.mui-scroll').html(template('detail',data));
        //初始哈轮播图
        mui('.mui-slider').slider({
            interval:2000
        });

        mui('.mui-scroll-wrapper').scroll({
                //这里初始化滚动
                // deceleration:0.0005  //flick  减速系数，系数越大，滚动越慢，滚动距离越小，默认值0.0006
                indicators:false  //这个就是不显示滚动条
            }
        );

        //1,商品加载完毕后，点击尺码的选择
        $('.btn_size').on('tap',function () {
            $(this).addClass('now').siblings().removeClass('now');
        });
        //2,点击数量的选择
        $('.p_number span').on('tap',function () {
            //判断是加还是减
            var currNum = $(this).siblings('input').val();
            var maxNum = parseInt($(this).siblings('input').attr('data-max'));
            if($(this).hasClass('jian')){
                if(currNum == 0){
                    mui.toast('数量不能少于0');
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

        //3,加入购物车
        $('.btn_addCart').on('tap',function () {
            //数据校验
            var $changeBtn = $('.btn_size.now');
            if( !$changeBtn.length ){
                mui.toast('请您选择尺码');
                return false;

            }
            var num = $('.p_number input').val();
            if( num <= 0){
                mui.toast('请您选择数量');
                return false;
            }
            //提交数据
            CT.loginAjax({
                //如果跨域的话,
                //jsonp:,
                url:'/cart/addCart',
                type:'post',
                data:{
                    productId:id,
                    num:num,
                    size:$changeBtn.html()
                },
                dataType:'json',
                success:function (data) {

                    // //将这个判断是否登录的功能封装成函数
                    // if(data.error == 400){
                    //     //跳转到登录页 并且把当前地址传递给登录页面 当登录成功按照这个地址跳转回来
                    //     return false;
                    if(data.success == true){
                        //弹出提示框


                        var btnArr = ['是','否'];
                        //参数  1,消息内容 2，标题  3 btn text 4，点击btn的回调函数
                        mui.confirm('添加成功，去购物车看看？','温馨提示',btnArr,function (e) {
                            if(e.index == 0){
                                location.href = CT.cartUrl;
                            }
                            else{

                            }
                        });
                    }

                }
            });
            
        });

    })
});

var getProductData = function (productId,callback) {
    $.ajax({
        url:'/product/queryProductDetail',
        type:'get',
        data:{
            id:productId
        },
        dataType:'json',
        success: function (data) {

            setTimeout(function () {
                callback && callback(data);
            },1000);

        }
    });
};














