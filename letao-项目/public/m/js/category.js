$(function () {
    //一级分类默认渲染  第一个一级分类对应的二级分类
    getCategoryData(function (data) {
        //一级分类默认渲染
        //模板的使用顺序  : json数据 ，定义模板，调用模板，返回html
        $('.cate_left ul').html(template('firstTemplate',data));
        //绑定事件
        // initSecondTapHandle();


        render($('.cate_left ul li:first-child').find('a').attr('data-id'));

    
    });
    

    //点击一级分类加载对应的二级分类  应该等一级分类模板加载完毕之后使用
    // var initSecondTapHandle = function () {
    //     $('.cate_left li').on('tap',function () {
    //
    //     });
    // } ;

    //或者使用委派的方式  点击一级分类加载对应的二级分类
    $('.cate_left').on('tap','a',function (e) {
        //如果当前点击的分类就是激活的，那么就不会加载数据
        if($(this).parent().hasClass('now')){
            return false;
        }


        //样式的选中
        $('.cate_left li').removeClass('now');
        $(this).parent().addClass('now');
        //数据的渲染
        render($(this).attr('data-id')) ;

    });



});

//获取一级分类的数据
var getCategoryData = function (callback) {


    $.ajax({
        url: '/category/queryTopCategory',
        type: 'get',
        data: '',
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            callback && callback(data);
        }
    });

};


//获取二级分类的数据
var getSecondcategoryData = function (params,callback) {
    $.ajax({
        url: '/category/querySecondCategory',
        type: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            //console.log(data);
            callback && callback(data);
        }
    });
};

//直接封装一个渲染二级分类的函数
var render = function (categoryId) {
    getSecondcategoryData({
        id:categoryId
    },function (data) {
        $('.cate_right ul').html(template('secondTemplate',data));
    })
};












