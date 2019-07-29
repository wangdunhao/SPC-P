package action;

import org.nutz.mvc.annotation.Encoding;
import org.nutz.mvc.annotation.Fail;
import org.nutz.mvc.annotation.IocBy;
import org.nutz.mvc.annotation.Modules;
import org.nutz.mvc.annotation.Ok;
import org.nutz.mvc.annotation.SetupBy;
import org.nutz.mvc.ioc.provider.ComboIocProvider;

import config.MainSetup;

@Modules(scanPackage=true)
@Fail("json")
@Ok("json")
@IocBy(type=ComboIocProvider.class,args={
		"*org.nutz.ioc.loader.json.JsonLoader","/config/",
		"*org.nutz.ioc.loader.annotation.AnnotationIocLoader","action", "dao"})
@Encoding(input="UTF-8",output="UTF-8")
@SetupBy(value=MainSetup.class)
public class MainAction {

}
