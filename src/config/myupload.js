/**
 * http://usejsdoc.org/
 */
var ioc = {
		utils : {
			type : 'config.Utils',
		    fields : {
		        sc : {app:'$servlet'}   // 将 ServletContext 对象注入 MyUtils
		    }
		},
		filePool : {
			type : "org.nutz.filepool.NutFilePool",
			args : [ {java:'$utils.getPath("/files/")'}, 10 ]
		},
		uploadCtx : {
			type : "org.nutz.mvc.upload.UploadingContext",
			args : [{refer : "filePool"}],
			singleton : false,
			fields : {
				maxFileSize : 10240000,
				nameFilter : ".+(xls|xlsx|XLS)$"
			}
		},
		myupload : {
			type : "org.nutz.mvc.upload.UploadAdaptor",
			singleton : false,
			args : [{refer : "uploadCtx"}]
		}
};