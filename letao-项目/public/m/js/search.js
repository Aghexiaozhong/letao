$(function () {
    $('.ct_search a').on('tap',function () {
        //跳转去搜索列表页  并且带上关键字
        var keyword = $.trim($('input').val()) ;
        //判断 没有关键字就提示用户  请输入关键字搜索

        if(!keyword){
            mui.toast('请输入关键字搜索');
        }
        //如果合法  searchlist.html?key=xxx
        else{
            location.href =  './searchlist.html?key='+keyword;
        }



    });
});











