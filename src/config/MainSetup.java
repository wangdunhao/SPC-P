package config;

import org.nutz.dao.Dao;
import org.nutz.mvc.NutConfig;
import org.nutz.mvc.Setup;
import org.nutz.resource.Scans;

/*import dao.NutzBasicDao;*/

public class MainSetup implements Setup {

    
	//private static final Log log =Logs.get();
	
	
    @Override
	public void init(NutConfig conf) {
    	//log.debug("congig ioc="+ conf.getIoc());
    	
		/*conf.getIoc().get(NutzBasicDao.class);*/
		Dao dao = conf.getIoc().get(Dao.class);
		for (Class<?> klass : Scans.me().scanPackage("model"/*映射数据库表的model所在的package*/)) {
			if (klass.getAnnotation(org.nutz.dao.entity.annotation.Table.class) != null) {
				//dao.getEntity(klass);
				dao.create(klass, false);
			}
//			if(null !=klass.getAnnotation(Table.class)){
//				dao.create(klass, false);
//			}
			// 初始化默认根用户
//	        if (dao.count(User.class) == 0) {
//	            User user = new User();
//	            user.setName("admin");
//	            user.setPassword("123456");
//	            
//	            dao.insert(user);
//	        }
		}
	}
	// 注意是init方法,不是destroy方法
//    public void init(NutConfig conf) {
////        Ioc ioc = nc.getIoc();
////        Dao dao = ioc.get(Dao.class);
//        conf.getIoc().get(NutzBasicDao.class);
//		Dao dao = conf.getIoc().get(Dao.class);
//        // 如果提示没有createTablesInPackage方法,请确认用了最新版的nutz,且老版本的nutz已经删除干净
//        Daos.createTablesInPackage(dao, "model", false);
//
//        // 初始化默认根用户
//        if (dao.count(User.class) == 0) {
//            User user = new User();
//            user.setName("admin");
//            user.setPassword("123456");
//            dao.insert(user);
//        }
//    }
    @Override 
    public void destroy(NutConfig conf) {
    }

}
