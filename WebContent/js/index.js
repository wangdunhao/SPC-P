$(function(){
	//dataInfoList();
	//getDataList();
	  // 用于上传时显示提示
	    var opts = {
		lines : 12, // 花瓣数目
		length : 10, // 花瓣长度
		width : 5, // 花瓣宽度
		radius : 10, // 花瓣距中心半径
		corners : 1, // 花瓣圆滑度 (0-1)
		rotate : 0, // 花瓣旋转角度
		direction : 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
		color : '#6fb3e0', // 花瓣颜色
		speed : 1, // 花瓣旋转速度
		trail : 60, // 花瓣旋转时的拖影(百分比)
		shadow : false, // 花瓣是否显示阴影
		hwaccel : false, // spinner 是否启用硬件加速及高速旋转
		className : 'spinner', // spinner css 样式名称
		zIndex : 2e9, // spinner的z轴 (默认是2000000000)
		top : 'auto', // spinner 相对父容器Top定位 单位 px
		left : 'auto', // spinner 相对父容器Left定位 单位 px
		position : 'relative', // element position
		progress : true, // show progress tracker
		progressTop : 0, // offset top for progress tracker
		progressLeft : 0
	    // offset left for progress tracker
	    };
	    spinner = new Spinner(opts);
});
//保留n位小数
function roundFun(value, n) {
  return Math.round(value*Math.pow(10,n))/Math.pow(10,n);
} 
//计算分析
function calculateSPC(){
	//定义四个数组，用于存放计算结果
	var defectiveRate=new Array();
	var overallDefectiveRate=new Array();
	var UCL=new Array();
	var LCL=new Array();
	
	var a=new Array();  //计算不合格率点在哪一侧
	var b=new Array();  //计算不合格率点上升或下降趋势
	var c=new Array();  //计算点是否位于中心线1/3处
	
	var datanum = $('#myBootstrapTtable').bootstrapTable('getData').length;	//获取数据长度
	var datas = $('#myBootstrapTtable').bootstrapTable('getData');
	var JsonDatas = eval(JSON.stringify(datas));
	
	$("#sampleAnalysisTable").bootstrapTable('removeAll'); //每次计算时，删除原table
	
	if(datanum == 0){
		alert("请输入数据！");
		document.getElementById("analyzeResultSPC").style.display = "none";
	}
	else{	//开始计算
        for(var i=0;i<datanum;i++){ 
    		var defectData = JsonDatas[i].defectiveData;//不合格品数据  
    		var testSumData = JsonDatas[i].sumData;//检验产品总数
    		defectiveRate[i]=roundFun((defectData/testSumData), 3); //计算不合格品概率
    		var sum1=0; //总不合格产品数
    		var sum2=0; //总检验产品数
        	for(var j=0;j<datanum;j++){   
        		var defectData1 = JsonDatas[j].defectiveData;  //不合格品数据
        		var testSumData1 = JsonDatas[j].sumData;     //检验产品总数
        		sum1 =parseInt(sum1) + parseInt(defectData1); //转化为数值相加
        		sum2 =parseInt(sum2) + parseInt(testSumData1);
    		}
    		overallDefectiveRate[i] =roundFun((sum1 / sum2), 3);//计算总体样本不合格率
    		var v=Math.sqrt((overallDefectiveRate[i]*(1-overallDefectiveRate[i]))/testSumData); //计算标准差
    		    v=roundFun(v, 3)
            //计算UCL和LCL
    		UCL[i]=roundFun((overallDefectiveRate[i]+3*v), 3);
    		LCL[i]=roundFun((overallDefectiveRate[i]-3*v), 3);
    		if(LCL[i]<0){
    			LCL[i]=0;  //当下控制线小于0时，其取0
    		}
        } 
      //生成P控制图
        drawSPC_P(defectiveRate,UCL,LCL,overallDefectiveRate);  
    	document.getElementById("analyzeResultSPC").style.display = "block"; //显示
    	
    	var def=0;   //判定是否有超出控制线的点
    	var t=new Array;  //记录连续上升个数并存放在数组中
    	var tt=1;
    	var s=new Array;  //记录连续下降个数并存放在数组中
    	var ss=1;
    	var m=new Array;  //记录位于中心线上侧的点个数并存放在数组中
    	var mm=1;
    	var n=new Array;  //记录位于中心线下侧的点个数并存放在数组中
    	var nn=1;
       
    	var qq=0;   //记录位于中心线1/3外侧处的点数
    	var pp=0;    //记录位于中心线1/3内侧处的点数
    	
    	//判断是否连续7个点以上在同一侧或上升下降、是否位于中心线1/3处
    	for(var i=0;i<datanum;i++){
    		a[i]=defectiveRate[i+1]-overallDefectiveRate[i];   //计算点位于中心线哪一侧
        	b[i]=defectiveRate[i+1]-defectiveRate[i];          //计算上升或下降趋势
        	c[i]=Math.abs(a[i])-(yHight / 6);     //计算点是否位于中心线1/3内 	
        }
    	
        for(var i=0;i<datanum;i++){
        	//以表格形式呈现计算结果
    		 defectiveRate1=defectiveRate[i];
    		 UCL1=UCL[i];
    		 LCL1=LCL[i];
    		 CL1=overallDefectiveRate[i];
    		var analysisTableData={
    				procedureIdForDelete:datanum+1,//datanum+1
    				defectiveRate1,
    				UCL1,
    				LCL1,
    				CL1
    		}
    		$('#sampleAnalysisTable').bootstrapTable('append', analysisTableData);	
    		  //判定是否有超出控制线的点	
    		if(defectiveRate1 > UCL1 || defectiveRate1 < LCL1){	
    			def=1;
    		}
        	//判断是连续在中心线一侧个数并存放在数组中
        	if(a[i]>0){
        		mm++;
        		nn=1;
        		m[i]=mm;
        		n[i]=nn;
        	}else if(a[i]<0){
        		mm=1;
        		nn++;
        		m[i]=mm;
        		n[i]=nn;
        	}
        	//判断连续上升或下降个数并存放数组中
        	if(b[i]>0){
            	tt++;
            	ss=1;
            	t[i]=tt;
            	s[i]=ss;
            }else if(b[i]<0){
            	tt=1;
            	ss++;
            	t[i]=tt;
            	s[i]=ss;
            }
        	//计算点位于中心线1/3外侧还是内侧的点数
        	if(c[i]>0){
        		qq++;
        	}else{
        		pp++;
        	}
        }	
    	
        var m_max=Math.max(...m);   //获取数组中在同一侧个数的最大值
        var n_max=Math.max(...n);
        var t_max=Math.max(...t);   //获取数组中连续上升或下降个数的最大值
        var s_max=Math.max(...s);
        
        var myconclusion=$("#td9").text("");  //清空结论文本
        //判定原则
    	if(def>0 || m_max>=7||n_max>=7 || t_max>=6||s_max>=6 ||pp>=datanum * (3/4) ||pp<=datanum * (1/2)){
    		if(def>0){	
    			$("#td9").text("存在超出控制线的点！");         
    		}
    	    if(m_max>=7){
    			$("#td9").append("<text> <br>存在连续7个点在中心线上侧！</text>");	
    		}
    	    if(n_max>=7){
    			$("#td9").append("<text> <br>存在连续7个点在中心线下侧！</text>");	
    		}
    	    if(t_max>=7){
    	    	$("#td9").append("<text> <br>存在7个及以上个点连续上升！</text>");	
    	    }
    	    if(s_max>=7){
    	    	$("#td9").append("<text> <br>存在7个及以上个点连续下降！</text>");	
    	    }
    	    if(pp>=datanum * (3/4)){
    	    	$("#td9").append("<text> <br>多于3/4的点落在中心线附近1/3范围内！</text>");
    	    }
    	    if(pp<=datanum * (1/2)){
    	    	$("#td9").append("<text> <br>少于1/2的点落在中心线附近1/3范围内！</text>");
    	    }
    	}else{
    		$("#td9").text("数据无异常现象！");
    	}
	}
}
var yHight;  //定义全局变量，获取图表y轴大小，并在其它函数中引用
//画P图函数
function drawSPC_P(data1,data2,data3,data4){
	var chart = Highcharts.chart('container1', {
		title: {
			text: 'P控制图',
			style:{
				 color:"#000",
		    }
		},
		style:{
			borderWidth:'2px'
		},
		tooltip: {           //数据提示框
			backgroundColor:'#fff',
			animation: true  ,
			borderWidth: 2,
			borderColor: '#AAA',
			shadow: true, 
			shared:true
		},
		xAxis:{
			title:{
				text:"序号"
			},
			tickInterval:1,  //x轴间隔设为1
			gridLineWidth:1,
			gridLineColor: '#C0C0C0',
			gridLineDashStyle:'Solid',
			allowDecimals:false
		},
		yAxis: {
			title: {
				text: ""
			},
			gridLineWidth:1,
			gridLineColor: '#C0C0C0',
			gridLineDashStyle:'Solid',
			min:-0.005 //y轴最低点
		},
		plotOptions: {
			series: {
				label: {
					connectorAllowed: false
				},
				pointStart: 1  //从1开始
			}
		},
		function (chart) { 
			renderMinMaxLabel(chart);
			},
		series: [{
			name: '不合格率p',
			data: data1,
			color:'#16bcb4',
		}, {
			name: '上控制线UCL',
			data: data2,
			color:'#f16522',
			dashStyle: 'dot'
		}, {
			name: '下控制线LCL',
			data: data3,
			dashStyle: 'dot',
			color:'#a763a9'
		}, {
			name: '中心线CL',
			data: data4,
			lineWidth:2,
			color:'#00aeef'
		},
//		{
//			zones: [{    //数据分区，未实现
//				value: data2,
//				color: '#f7a35c',
//				dashStyle: 'dot'
//			}]
//		}
		],
		responsive: {
			rules: [{
				condition: {
					minWidth: 1
				},
				chartOptions: {
					legend: {
						layout: 'horizontal',
						align: 'center',
						verticalAlign: 'bottom'
					}
				}
			}]
		}
	});
	var yMin=chart.yAxis[0].min;  //获取y轴最小值
	var yMax=chart.yAxis[0].max;   //获取y轴最大值
    yHight=yMax-yMin;
//    $("#yHightHide").value=yHight;
}
//将Excel数据保存至数据库
function saveExcelData(){
	var datanum = $('#myBootstrapTtable').bootstrapTable('getData').length;	
	if(projectId == 0){
		alert("尚未选择与之对应的项目，请另存为一个新项目！");
		$('#saveAsNewProjectModal').modal();		
	}
	else{
		var datas = $('#myBootstrapTtable').bootstrapTable('getData');
		$.ajax({
		    url:"/projectManager/api/v1/project",
		    type:"put",
		    data:{
		        id:projectId,
		        projectName:projectName,
		        memo:'',
		        appResult:'',
		        tempProjectID:"",
		        appContent:JSON.stringify(datas),
		        reservation:""
		    },
		    success:function(result){
		          if(result.state){	
		        	  alert("Excel信息保存数据库成功！");  //请求成功
		           }
		          else{
		        	  alert("Excel信息保存数据库出现错误！");  //请求错误
		          }
		    }
		})
	}
}
//另存为之前首先检查是否选中了一个项目，然后再执行另存为
function checkAndShowModal(){
	if(projectId == 0){   //未选择项目的情况下不能另存为
		alert("请先选择一个项目，然后另存为！");
	}
	else{
		$('#saveAsNewProjectModal').modal();		
	}
}
//另存为一个新项目
function saveAsNewProject(){
	// 获取输入框中的内容
    var projectName = $('#newProjectName')[0].value;//获取项目名
    var createTime = new Date().toLocaleDateString() + ',' + new Date().getHours() + ':' + new Date().getMinutes();//获取项目创建时间
    var memo = $('#newProjectRemark')[0].value;//获取备注
    var datas = $('#myBootstrapTtable').bootstrapTable('getData');
    var data = {
        "id": 0,
        "createTime": createTime,
        "editTime": createTime,
        "projectName": projectName,
        "memo": memo,
        "appContent":JSON.stringify(datas),
        "appResult": appResult
    };
    //获取数据库所有项目名
    $.ajax({
        url: "/projectManager/api/v1/project",
        type: "get",
        async: false,
        dataType: "json",
        success: function (result) {
            projectNameArr.length = 0;//数组清零
            result.content.forEach(function (element, index, array) {
                projectNameArr.push(element.projectName);
            })
        }
    });
    //表格添加数据
    if (projectName === ''||projectName.match(/^\s*$/)) {
        alert("请输入项目名！！！");
    } else if (projectName.length > 25) {
        alert("项目名长度不能超过25个汉字，请重新输入");
    } else if (projectNameArr.indexOf(projectName) !== -1) {
        alert("项目已经存在，请重新输入项目名！！！");
    } else {
        // 添加数据库
        $.ajax({
            type: "post",
            url: "/projectManager/api/v1/project",
            data: data,
            success: function (result) {
            	alert("另存为新项目成功！");
                if (result.state) {
                    $('.selectList').prepend('<li class="">\n' +
                        '\t\t\t\t\t<a >\n' +
                        '\t\t\t\t\t\t<div>\n' +
                        '\t\t\t\t\t\t\t<div class="sideProjectLi" onmouseover="this.title = this.innerHTML;" onclick="sideCheck(' + result.content.id + ',this)">\n' +
                        '\t\t\t\t\t\t\t\t' + result.content.projectName + '\n' +
                        '\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t<div style="position:absolute;bottom:6px;right:5px;">\n' + 
                        '\t\t\t\t\t\t\t\t<i class="ace-icon fa fa-pencil align-top bigger-125 purple" id="checkSideLi" onclick="modifyBasicInfo(' + result.content.id + ',this)" data-toggle="modal" data-target="#basicInfo"></i>\n' +
                        '\t\t\t\t\t\t\t\t<i class="ace-icon fa fa-trash-o bigger-120 red" id="deleteSideLi" onclick="removeProject(' + result.content.id + ')"></i>\n' +
                        '\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t</a>\n' +
                        '\t\t\t\t</li>');
                    //侧边栏高度适应
                    var height = $(window).get(0).innerHeight;//获取屏幕高度
                    if ($('#cityList').children('li').length * 36 < height - 310) {
                        $('.selectList').css('height', $('#cityList').children('li').length * 36);
                    } else {
                        $('.selectList').css('height', height - 310);
                    }
                    //移除属性标注
                    for (var i = 0; i < $('.submenu.nav-show.selectList').find('li').length; i++) {
                        $($('.submenu.nav-show.selectList').find('li')[i]).removeAttr('class');
                    }
                    //高亮项目
                    $('#cityList').children('li').first().attr('class', 'active highlight');
                    //面包屑显示项目名
                    $('.showProjectNameDiv').html($('#cityList').children('li').first()[0].innerText);
                    $('.showProjectNameDiv').removeAttr('style');
                    projectId = result.content.id;//项目全局ID
                    data.id = result.content.id;
                    $('#dynamic-table').DataTable().row.add(data).draw(false);
                    addSelfDefine(result);
                }
            }
        });
        $('#saveAsNewProjectModal').modal('hide');//隐藏模态框
        // 在前台添加表格
    }
}
//添加样本
function addSample(){
	var datanum = $('#myBootstrapTtable').bootstrapTable('getData').length;
//	console.log(datanum);
	var rowdata= {
			procedureIdForDelete:datanum+1,
			defectiveData:$("#defectiveData").val(),
			sumData:$("#sumData").val(),
	    };
	if($("#msaData").val() == ""){
		alert("信息不能全为空，请重新填写！");
	}
	else{
		$('#myBootstrapTtable').bootstrapTable('append', rowdata);
	}
	for(var i=0;i<datanum;i++){   //添加样本超过10个时，table自动翻页
		if(datanum=10*i+1){
			$("#myBootstrapTtable").bootstrapTable('nextPage');
		}
	}
}
var updateindex = 1;
window.actionEvents = {
    'click .edit': function (e, value, row, index) {
    	$('#updatedatainfo').modal('show');
    	$("#defectiveData_u").val(row.defectiveData);
    	$("#sumData_u").val(row.sumData);
    	$("#procedureId_u").val(row.procedureId); //不可见，不能改
    	updateindex = index;
        // console.log(row);
     }
}
//编辑菜单
function actionFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" title="Edit">',
        '<i class="glyphicon glyphicon-edit"></i> 编辑',
        '</a>'
    ].join('');
}
//删除函数
function deleterow() {
	//遍历数组中的每个元素，并按照return中的计算方式 形成一个新的元素，放入返回的数组中
	var ids = $.map($('#myBootstrapTtable').bootstrapTable('getSelections'), function (row) {
        return row.procedureIdForDelete;
    });
	$('#myBootstrapTtable').bootstrapTable('remove', {field: 'procedureIdForDelete', values: ids});
}
//更改样本数据
function editItem() {
	$('#updatedatainfo').modal('hide');
	////更改表格数据
	var rowdata= {
			defectiveData:$("#defectiveData_u").val(),
			sumData:$("#sumData_u").val(),
    };
	$('#myBootstrapTtable').bootstrapTable('updateRow',{index: updateindex, row: rowdata});
}
//生成序号自加+1
function generateId(value,row,index) {
	return index+1;
}
//导出excel表格
function downloadexcel(){		
	window.location.href="files/excel/temp_index.xls";
}
//将Excel数据添加至表格
function addExcelData(data){
	var json = eval(data);
	for (var i=0;i<json.length;i++) {
		var datanum = $('#myBootstrapTtable').bootstrapTable('getData').length;
		var rowdata= {
				procedureIdForDelete : datanum + 1,			
				defectiveData: json[i].defectiveData,
				sumData: json[i].sumData,
		    };
//		console.log(datanum + 1);
		$('#myBootstrapTtable').bootstrapTable('append', rowdata);
	}
}
//校验选择文件是否符合上传规范
function checkfile(){
	var filesuffix = $("#data-excel").val();
	filesuffix = filesuffix.substring(filesuffix.lastIndexOf("."));	
	if(filesuffix == ".xls"||filesuffix == ".XLS"){
		return true;
	}else{
		alert("文件格式暂不支持，\n\n请将文件转为“Excel 97-2003 工作簿（*.xls或||*.XLS）”，再上传！");
		return false;
	}
}
//添加时 弹出上传提示
function openwin() {
    if ($("#data-excel").val() != "") {
		   var target = $("#spindiv").get(0);
		   spinner.spin(target);
		   timers = setInterval("excelfource()", 2000);
		   //$("#addselectfilemodal").hide();
    } else {
	   alert("请选择文件！");
    }
}
function excelfource() {
    var re =$("#iframeInfo").contents().find("pre").html();
//    console.log(re);
    if(re!=""){
		$("#iframeInfo").contents().find("pre").html("");
		spinner.spin();// 关闭spinner
		clearInterval(timers);
		$('#addselectfilemodal').modal('hide');
		//window.location.reload();
		addExcelData(re);
    }
}
