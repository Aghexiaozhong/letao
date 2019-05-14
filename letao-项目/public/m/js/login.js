$(function () {



    $('#submit').on('tap',function () {
        //1,将登录页的用户名和密码提交给后台 序列化表单数据
        //input 必须有name 属性值
        var data = $('form').serialize();
        //2,
        //console.log(data);


        //对于json未定义  使用json2来解决IE 6,7的兼容问题

        //data要转换为对象  'key=value&k=v'
        var dataObject = CT.serialize2Object(data);
        console.log(dataObject); //{"username":"..","password":".."}

        //3,发送数据给后台  valid(校验)
        if(!dataObject.username){
            mui.toast('请您输入用户名');
            return false;
        }
        if(!dataObject.password){
            mui.toast('请您输入密码');
            return false;
        }


        $.ajax({
            url:'/user/login',
            type:'post',
            data:dataObject,
            dataType:'json',
            success:function (data) {
                //如果成功根据传过来的地址跳转
                // 如果没有地址传过来，跳到个人中心首页,根据地址栏上的
                //returnUrl=  后面是否还有地址来判断是否传递了地址

                //console.log(data+'====================');
                 if(data.success == true){

                   //用户名密码正确
                    var returnUrl = location.search.replace('?returnUrl=','');
                    if(returnUrl){
                        location.href = returnUrl;
                    }else{
                        location.href = CT.userUrl;
                    }
                }else{
                    //用户名密码没有通过
                    mui.toast(data.message);
                }
            }
        });
    });


});




















