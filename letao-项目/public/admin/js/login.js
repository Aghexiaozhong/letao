$(function () {
    //使用bootatrap的校验插件  bootatrap-validator 就是一个JQ插件
    //初始化校验插件
    //1,是form表单结构 并且有一个提交按钮
    $('#loginForm').bootstrapValidator({
        //message:'',  //没有错误提示的时候使用这个
        //配置校验不同状态下的图标
        feedbackIcons:{
            valid:'glyphicon glyphicon-ok',
            invalid:'glyphicon glyphicon-remove',
            validating:'glyphicon glyphicon-refresh'
        },
        //需要校验的属性（表单元素） 通过名称
        fields:{
            //对应表单元素的name
            username:{
                //校验规则  比如不能为空、不能有数字  这里是配置多个规则
                validators:{
                    notEmpty:{
                        message:'用户名不能为空'

                    }, //配置一个校验规则，关于后台的 比如密码错误
                        callback:{
                        message:'用户名错误'
                        }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:'密码不能为空',
                    },


                    stringLength:{
                        min:6,
                        max:18,
                        message:'密码长度必须在6-18位之间'
                    },
                    //配置一个校验规则，关于后台的
                    callback:{
                        message:'密码错误'
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
        //并且提交的数据得是JQ对象序列化后的
        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            data: $form.serialize(),
            dataType:'json',
            success:function (data) {
                //业务上的成功
                if(data.success == true){
                    //跳转到后台的首页  不能直接跳转 ，得显示进度条，因为线上加载需要时间的
                    //所以使用进度条插件 nprogress

                    location.href = '/admin/index.html';
                }

                //业务的失败
                else{
                    if(data.error == 1000){
                        //用户名错误  设置用户名这个表单元素的状态为失败

                        //四个状态  NOT_VALIDATED VALIDAING  INVALID 失败 VALID 成功
                        //1,获取校验组件
                        // 2,调用更改状态的函数 三个参数
                        // 1，校验的表单元素 2， 改成什么状态 3，使用哪个校验规则
                        $form.data('bootstrapValidator').updateStatus('username','INVALID','callback');

                    }else if(data.error == 1001){
                        //密码错误
                        $form.data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    }
                }
            }
        });


    });
});