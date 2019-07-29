var projectId = 0;//项目Id
var projectName;//项目名
var appResult = null;//word报告
var appNameChinese = 'P控制图';//app中文名（必填）
var USER_NAME = '';//当前登录用户名
// 添加项目后，自定义操作
function addSelfDefine(result) {
    //上一层函数查看basicAction.js中addProject()函数
    /*
    * your code.....
    **/
	$("#myBootstrapTtable").bootstrapTable('removeAll'); //添加项目后，删除原table
    console.log("add project successful");
}
// 查看项目后，自定义操作
function checkSelfDefine(node, result) {
	$("#myBootstrapTtable").bootstrapTable('removeAll'); //查看时，删除原tabl
	//读取数据库数据并生成table
	if(result.state && result.content.appContent != ""){
		var json = eval(result.content.appContent);   
		var datanum = json.length;
		for(var i=0;i<datanum;i++){
			var defectiveData = json[i].defectiveData;
			var sumData = json[i].sumData;
			var rowdata= {
					procedureIdForDelete:datanum+1,
					defectiveData,
					sumData
			    };
		$('#myBootstrapTtable').bootstrapTable('append', rowdata);
		}
		document.getElementById("analyzeResultSPC").style.display = "none"; //点击左侧查看时P图计算结果不显示
		$("#WYeditor").html("");   //加载前先清空报告编辑内容
	}else {
        console.log(result.error);
    }
}
//删除项目后，自定义操作
function removeSelfDefine(result) {
    // 上一层函数查看basicAction.js中removeProject()函数
    /*
    * your code.....
    **/
    console.log("remove project successful");
}
//定制初始化内容
function setCustomContext() {
	$("#WYeditor").html("");   //加载前先清空
    var title = "P控制图App使用结果";
    var chap1 = "计算结果";
    var myconclusion=$("#td9").html();
    title = "<h2>1 " + title + "</h2>";
    chap1 = "<h3>1.1 " + chap1 + "</h3>";
    chap2 = "<h3>1.2  结论： <br>" + myconclusion + "</h3>";
    canvg();  //将SVG格式的图片转化成canvas格式
    var canv0 = document.getElementsByTagName("canvas")[0]; 
    
    var image0 = new Image();
   
    if (canv0 != null) {
    	image0.src = canv0.toDataURL("image/png");
    } 
    
    var editor = $("#WYeditor");
    editor.append(title,chap1,image0,chap2);
}



