//初始化区域滚动

$(function () {
    mui('.mui-scroll-wrapper').scroll({
            //这里初始化滚动
            // deceleration:0.0005  //flick  减速系数，系数越大，滚动越慢，滚动距离越小，默认值0.0006
            indicators:false  //这个就是不显示滚动条
        }
    );

    //  需求  1,页面初始化的时候关键字在input框中显示

    //获取关键字 将获取地址栏的信息的函数封装起来，成为全局的，供重复调用

    var urlParams = CT.getParamsByurl();
    var $input =  $('input').val(urlParams.key || '');

    // 2，根据接口，初始化页面,根据关键字查询第一页数据（4条）
    //但是下拉刷新已经配置了自动执行,所以不需要再次加载,重复操作
    // getSearchData({
    //     proName:$input.val(),
    //     page:1,
    //     pageSize:4
    // },function (data) {
    //     //console.log(data);
    //     //渲染数据
    //     $('.ct_product').html(template('list',data));
    // });

    //3,用户点击搜索的时候，根据新的关键字搜索商品 重置排序功能

    $('.ct_search a').on('tap',function () {
        var key = $.trim($input.val());
            if(!key){
                mui.toast('请输入关键字');
                return false;
            }
            getSearchData({
                proName:key,
                page:1,
                pageSize:4
            },function (data) {
                //console.log(data);
                //渲染数据
                $('.ct_product').html(template('list',data));
            });

        });

    //4,点击排序的时候根据排序的选项进行排序（默认的时候是降序(1),升序是2，再次点击就升序，箭头反转）
    $('.ct_order a').on('tap',function () {
        //当前点击的a
        var $this = $(this);
        //如果之前没有选中
        if(!$this.hasClass('now')){
            //选中 并且其他的不选中，默认箭头向下
            $this.addClass('now').siblings().removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

        }else{
            //如果被选中,该变当前的箭头的方向
            if($(this).find('span').hasClass('fa-angle-down')){
                $(this).find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{
                $(this).find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }

        //获取当前的点击的功能参数(1或2) price:1 ,2  num:1 ,2
        var order = $this.attr('data-order');

        var orderVal = $this.find('span').hasClass('fa-angle-up') ? 1:2;
        var key = $.trim($input.val());
        if(!key){
            mui.toast('请输入关键字');
            return false;
        }
        //获取数据
        var params = {
            page:1,
            proName:key,
            pageSize:4,


        };
        //排序的方法
        params[order] = orderVal;
        getSearchData(params,function (data) {
            $('.ct_product').html(template('list',data));
        });
    });
    
    
    //5,用户下拉的时候，根据当前的条件刷新 上啦加载的功能重置(因为如果滑到最后一页的时候，已经禁止了上拉加载，
    // 再点击下拉刷新会回到第一页，此时上拉加载功能已经禁用，所以要重置)  排序功能也重置
    //初始化下拉刷新
    mui.init({
        pullRefresh:{
            container:"#refreshContainer" , //下拉刷新的容器标志
            down:{
                // style:'circle',  //必选，下拉刷新样式
                // color:'#2BD009',
                // height:'50px',
                // range:'100px',
                // offset:'0px',  //下拉刷新控件的起始位置
                 auto:true,  //可选，默认是false,首次加载自动上拉刷新一次
                callback:function(){
                    //that 组件对象
                    var that = this;

                  // 后台获取数据
                    var key = $.trim($input.val());
                    if(!key){
                        mui.toast('请输入关键字');
                        return false;
                    }
                    //重置排序功能
                    $('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');


                    getSearchData({
                        proName:key,
                        page:1,
                        pageSize:4
                    },function (data) {
                        //console.log(data);

                        setTimeout(function () {
                            //渲染数据
                            $('.ct_product').html(template('list',data));
                            //注意：停止下拉刷新
                            that.endPulldownToRefresh();

                            //上拉加载重置
                            that.refresh(true)
                        },1000);


                    });

                }     //刷新函数

                },

            //上拉
            up:{
                callback:function () {
                    //that 组件对象
                    var that = this;

                    //加载下一个数据  记录当前页  然后page+1 就可以往后加载

                    window.page ++;
                    var key = $.trim($input.val());
                    if(!key){
                        mui.toast('请输入关键字');
                        return false;
                    }
                    //获取当前的点击的功能参数(1或2) price:1 ,2  num:1 ,2
                    var order = $('.ct_order a.now').attr('data-order');

                    var orderVal = $('.ct_order a.now').find('span').hasClass('fa-angle-up') ? 1:2;

                    var params = {
                        proName:key,
                        page:window.page,
                        pageSize:4
                    };
                    params[order] = orderVal;
                    getSearchData(

                        //上拉加载的时候要把排序方式一起带入

                    params,function (data) {
                        setTimeout(function () {
                            //上拉加载的时候追加数据
                            $('.ct_product').append(template('list',data));
                            //停止上拉加载
                            if( data.data.length){
                                that.endPullupToRefresh();
                            }else{
                                that.endPullupToRefresh(true);
                                //当data的长度为0的时候就停止加载，并显示没有数据了
                            }
                        },1000);




                    });
                }
            }

            }

    });

    //6,当用户上啦的时候， 加载下一页（如果没有数据，提示没有数据，并不再加载）
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
            up : {
                height:50,//可选.默认50.触发上拉加载拖动距离
                auto:true,//可选,默认false.自动上拉加载一次
                contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback :function(){

                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });
});


var getSearchData = function (params,callback) {
    $.ajax({
        url:'/product/queryProduct',
        type:'get',
        data:params,
        dataType:'json',
        success: function (data) {
            //在获取数据的时候就存储当前页码
            window.page = data.page;
            callback && callback(data);
        }
    });
};






