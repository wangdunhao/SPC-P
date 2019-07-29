package action;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.text.Format;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletContext;

import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.lang.Files;
import org.nutz.mvc.Mvcs;
import org.nutz.mvc.annotation.AdaptBy;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.Param;
import org.nutz.mvc.impl.AdaptorErrorContext;
import org.nutz.mvc.upload.TempFile;
import org.nutz.mvc.upload.UploadAdaptor;

import jxl.Sheet;
import jxl.Workbook;
import model.SPC_P;


@IocBean
@At("/jsp")
public class SPC_Paction  {
	@At("/inputDataExcel") 
	@AdaptBy(type=UploadAdaptor.class, args="ioc:myupload") 
	public List<SPC_P> uploadTempExcel(@Param("file")TempFile tmpFile, ServletContext sCtt, AdaptorErrorContext errCtx) {
		System.out.println("进入后台成功！");	
		// 文件不能为空
		List<SPC_P> list = new ArrayList<SPC_P>();
		if (errCtx != null) {
			System.out.println("false");
		}
		if (tmpFile == null) {
			System.out.println("false");
		}
		File file = tmpFile.getFile();
		// 文件不能小于1K
		if (file.length() < 1024) {
			System.out.println("false");
		}
		Format format = new SimpleDateFormat("yyyyMMddhhmmss");		
		// 图片名称使用时间  避免重复
		String name = format.format(new Date());
		// 图片格式
		String suffix = Files.getSuffixName(file).toLowerCase();
		try {
			String targetPath = String.format("%s\\%s.%s", excelRoot(), name, suffix);
			file.renameTo(new File(targetPath));			
			System.out.println(targetPath);
			File filetemp = new File(targetPath);
			jxl.Workbook rwb = null;
			try{
				InputStream is = new FileInputStream(filetemp);
				rwb = Workbook.getWorkbook(is);
				Sheet rs = rwb.getSheet(0);
				int rsRows = rs.getRows();  //获得行数
				int rsCols = rs.getRow(1).length;  //获取列数
				for(int i=2; i<rsRows; i++){
					SPC_P p = new SPC_P();
					String defectiveData = "";
					String sumData = "";
					/*for(int j=0; j<rsCols-1; j++){
						defectiveData += (rs.getCell(j,i).getContents() + ",");
					}
					defectiveData = (defectiveData.substring(0, defectiveData.length()-1));*/
					defectiveData = rs.getCell(rsCols-2, i).getContents();
					sumData = rs.getCell(rsCols-1,i).getContents();
					p.setDefectiveData(defectiveData);
					p.setSumData(sumData);
					list.add(p);
				}
				System.out.println("执行完毕！");
			}catch(Exception e){
				e.printStackTrace();
			}
			try{
				rwb.close();
			}catch(Exception e){
				System.out.println("出现错误！");
			}
		    filetemp.delete();
		    return list;
		} catch (Throwable e) {
			System.out.println("false");
			return null;
		}		
	}
	// 存放位置
	private static final String excelRoot() {	
		String path = Mvcs.getServletContext().getRealPath("/files/excel");
		return path;
	}
}
