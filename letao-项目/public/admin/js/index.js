$(function () {
    barCharts();
    pieCharts();


});

var barCharts = function () {
    //1,引入echarts.min.js文件
    //2,找到画图的容器
    var box = document.querySelector('.picTable:first-child');
    //初始化插件
    var myChart = echarts.init(box);

    var data = [
        {
            name:'一月',
            value:300
        },
        {
            name:'二月',
            value:30
        },
        {
            name:'三月',
            value:200
        },
        {
            name:'四月',
            value:500
        },
        {
            name:'五月',
            value:100
        },
        {
            name:'六月',
            value:250
        }
    ];

    var xData = [];
    var sData = [];
    data.forEach(function (item,i) {
        xData.push(item.name);
        sData.push(item.value);
    });
    //配置参数
    var options ={
        title:{
            text:'2018年注册人数'
        },
        color: ['red'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['一月', '二月', '三月', '四月', '五月', '六月'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'注册人数',
                type:'bar',
                barWidth: '60%',
                data:[100, 52, 200, 334, 390, 330]
            }
        ]
    };
    //设置参数
    options.xAxis[0].data = xData;
    options.series[0].data = sData;
    myChart.setOption(options);
};

var pieCharts = function () {
    var box = document.querySelector('.picTable:last-child');
    //初始化插件
    var myChart = echarts.init(box);
    var options = {
        title : {
        text: '热门品牌销售',
            subtext: '2018年6月',
            x:'center'
    },
    tooltip : {
        trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
            left: 'left',
            data: ['耐克','阿迪','百伦','安踏','李宁']
    },
    series : [
        {
            name: '销售比例',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'耐克'},
                {value:310, name:'阿迪'},
                {value:234, name:'百伦'},
                {value:135, name:'安踏'},
                {value:1548, name:'李宁'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]};
    //设置参数

    myChart.setOption(options);
};



















