package config;

import javax.servlet.ServletContext;

public class Utils {
	private ServletContext sc;

    public String getPath(String path) {
        return sc.getRealPath(path);
    }
}
