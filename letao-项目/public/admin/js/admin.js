//后台管理系统公共的js文件

//进度条显示
//了解JQ的AJAX相关的两个方法   $.get()  $.post()  $.load()  $.ajax()
//ajaxStart()   ajaxComplete()
// 当ajax请求没有响应过来，就显示进度条加载 ,当ajax结束，要进度条结束再隐藏

//相关配置  隐藏那个刷新的圆圈
NProgress.configure({showSpinner:false});
$(window).ajaxStart(function () {
    //开启进度条
    NProgress.start();
});

$(window).ajaxComplete(function () {
    //结束进度条
    NProgress.done();
});

//1,侧边栏的显示和隐藏 2 二级菜单的显示和隐藏
$('[data-menu]').on('click',function () {
    $('.ad_aside').toggle();
    $('.ad_section').toggleClass('menu');
});
$('.menu .category').on('click',function () {

    $(this).siblings('.child').slideToggle();
});

// 3,推出功能
//把html 格式的字符串转成js字符串拼接 数组拼接

var modalHtml =  '<div class="modal fade" id="myModal" tabindex="-1">'+
    '    <div class="modal-dialog modal-sm">'+
    '        <div class="modal-content">'+
    '            <div class="modal-header">'+
    '                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>'+
    '                <h4 class="modal-title">温馨提示</h4>'+
    '            </div>'+
    '            <div class="modal-body">'+
    '                <p class="text-danger"><span class="glyphicon glyphicon-exclamation-sign"></span> 您确定要退出后台管理系统吗？</p>'+
    '            </div>'+
    '            <div class="modal-footer">'+
    '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>'+
    '                <button type="button" class="btn btn-primary">确认</button>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    '</div>';

$('body').append(modalHtml);
$('[data-logout]').on('click',function () {

    $('#myModal').modal('show').find('.btn-primary').on('click',function () {
        //退出业务 发送ajax请求
        $.ajax({
            url:'/employee/employeeLogout',
            type:'get',
            data:'',
            dataType:'json',
            success:function (data) {
                if(data.success == true){
                    $('#myModal').modal('hide');
                    //跳转登录页登录
                    location.href = '/admin/login.html';
                }
            }
        });



    });
    //需要一个模态框，每个页面都需要加载
    //绑定点击确认 的事件
});




























