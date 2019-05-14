$(function () {
    window.page = 1;
    //1，列表展示，默认第一页展示
    var render = function () {
        getSecCategoryData(function (data) {
            //使用魔板渲染
            console.log(data);
            $('tbody').html(template('secondCategory',data));
            //初始化分页组件 根据数据来渲染
            //2,分页展示
            $('.pagination').bootstrapPaginator({
                //对应bootstarp的版本
                bootstrapMajorVersion:3,
                //分页按钮的大小
                size:'normal',
                //当前显示的页码
                currentPage:data.page,

                //一共多少页
                totalPages: Math.ceil(data.total / data.size),
                //显示的按钮的数量
                numberOfPages:3,
                // 点击页码渲染功能
                //监听按钮的点击事件 获取点击时候的页码
                onPageClicked:function (event,originalEvent,type,page) {
                    //上面四个参数  1,JQ的事件对象  2，原生dom的事件对象
                    // 3，按钮的类型(上一页  当前页 下一页)
                    // 4，按钮对应的页码
                   // console.log(event);
                    window.page = page;
                    render();

                }
            });


        });


    };
    render();


    //3.点击添加品牌弹出一个模态框
    getFirstCategoryData(function (data) {
        //console.log(data);
        //显示选中的分类名称

        $('.dropdown-menu').html(template('dropdown2',data)).on('click','li',function () {
            var categoryName = $(this).find('a').html();

            var $currA = $(this).find('a');
            $('.categoryName1').html(categoryName);
            //给隐藏的ID表单赋值
            $('[name="categoryId"]').val($currA.attr('data-id'));
            //该校验状态 $('form').data()拿到组件对象
            $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID');
        });
    });
    //上传图片 使用插件 oploadify
    initFileUpload();
    //4.点击确认按钮，提交数据（一级分类id,二级分类的名称,（id自动生成）,二级分类的logo）
    // $('#myModal2').on('.btn-primary','click',function (e) {
    //
    // });
    $('#form').bootstrapValidator({
        //默认校验的表单元素（不包含隐藏）
        //设置校验隐藏元素  写成空就是全部不排除校验，就是都会校验，包含隐藏 禁用等表单元素
        excluded:[],
        //message:'',  //没有错误提示的时候使用这个
        //配置校验不同状态下的图标
        feedbackIcons:{
            valid:'glyphicon glyphicon-ok',
            invalid:'glyphicon glyphicon-remove',
            validating:'glyphicon glyphicon-refresh'
        },
        //需要校验的属性（表单元素） 通过名称
        fields: {
            //对应表单元素
            //先校验是否选中一级分类 通过下面的input hidden类型中是否有值来判断
            categoryId: {
                //校验规则  比如不能为空、不能有数字  这里是配置多个规则
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'

                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请选择品牌名称',
                    }

                }
            },
            brandLogo:{
                validators: {
                    notEmpty: {
                        message: '请选择图片',
                    }

                }
            }
        }
    }).on('success.form.bv',function (e) {
        //点击提交后的事件
        //阻止form表单的默认提交，要使其使用ajax提交
        e.preventDefault();
        //console.log(e.target);
        var $form = $(e.target);  //将表单对象转换为jq对象
        //提交逻辑 校验成功将数据提交给后台 这里不需要使用CT.loginajax()拦截 因为后台已经拦截了
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {

                if(data.success == true){
                    //提交之后页面刷新为1
                    window.page = 1;
                    render();
                    $('#myModal2').modal('hide');
                }
            }


        });



    });
});

var getSecCategoryData = function (callback) {
    $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
        data:{
            page:window.page || 1,
            pageSize:5

        },
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }

    });
};

var getFirstCategoryData = function (callback) {
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:{
            page:1,
            pageSize:1000

        },
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }

    });
};


var initFileUpload = function () {
  //初始化上传图片的插件
    $('[name="pic1"]').fileupload({
        //上传地址
        url:'/category/addSecondCategoryPic',
        dataType:'json',
        //上传成功
        done:function (e,data) {
            $('#uploadImg').attr('src',data.result.picAddr);

            $('[name="brandLogo"]').val(data.result.picAddr);

            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });
};


















