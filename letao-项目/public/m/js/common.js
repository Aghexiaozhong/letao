window.CT = {};
//CT是一个全局对象，用来被调用的

CT.getParamsByurl = function () {
    //定义对象存储地址栏的信息
    var params = {};
    var search = location.search;
    if(search){
        search = search.slice(1);
        //如果有多个参数（键值对）
        var arr = search.split('&');
        arr.forEach(function (item,i) {
            var itemArr = item.split('=');
            params[itemArr[0]] = itemArr[1];

        });

    }

    return params;
};
//将当前页面地址用变量绑定 方便用于页面之间的跳转
CT.loginUrl = '/m/user/login.html';
CT.cartUrl = '/m/user/cart.html';
//定义用户个人中心首页的地址
CT.userUrl = '/m/user/index.html';

//将这个判断是否登录的功能封装成函数
CT.loginAjax = function (params) {

    $.ajax({
        type:params.type || 'get',
        url:params.url || "#",
        data:params.data || '',
        dataType:params.dataType || 'json',
        success: function (data) {
            //未登录的处理 所有需要登录的接口没有登录都会返回 {error:400,message:'未登录’}
            if (data.error == 400) {
                //跳转到登录页 并且把当前地址传递给登录页面 当登录成功按照这个地址跳转回来
                //location.href  当前页面地址
                location.href = CT.loginUrl + '?returnUrl=' + location.href;

                return false;
            }else{
                params.success && params.success(data);
            }
        },
        error:function () {
            mui.toast('服务器繁忙');
        }

    });
};

//定义一个数据转序列化的方法
CT.serialize2Object = function (serializeStr) {
    var obj = {};
    if(serializeStr){
        //'key=value&k=v'
        var arr = serializeStr.split('&');
        arr.forEach(function (item,i) {
            var itemArr = item.split('=');

            obj[itemArr[0]] = itemArr[1];
        })
    }
    return obj;
};

//通过id的方式获取数据
CT.getItemById = function (arr,id) {
    var item2 = null;
    arr.forEach(function (item,i) {
        if(item.id == id){
            item2 = item;
        }
    });

    return item2;
};







