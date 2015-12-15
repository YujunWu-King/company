/**
 * 
 */
package com.tranzvision.gd.TZSitePageBundle.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import com.tranzvision.gd.TZBaseBundle.service.impl.FrameworkImpl;
import com.tranzvision.gd.util.base.JacksonUtil;

/**
 * 原PS：TZ_SITE_DECORATED_APP:TZ_COLU_MG_CLS
 * 
 * @author SHIHUA
 * @since 2015-12-15
 */
public class TzColuMgServiceImpl extends FrameworkImpl {

	@Autowired
	private ApplicationContext ctx;

	@Autowired
	private JacksonUtil jacksonUtil;

	@Override
	public String tzQuery(String strParams, String[] errMsg) {

		String strRet = "";

		try {

			jacksonUtil.json2Map(strParams);
			String strAppCls = jacksonUtil.getString("appCls");

			if (null != strAppCls && !"".equals(strAppCls)) {

				Object appClsObj = ctx.getBean(strAppCls);
				if (appClsObj != null) {

					FrameworkImpl tzFrameworkImplObj = (FrameworkImpl) appClsObj;

					strRet = tzFrameworkImplObj.tzQuery(strParams, errMsg);

					return strRet;
				}

			}

		} catch (Exception e) {
			e.printStackTrace();
			errMsg[0] = "1";
			errMsg[1] = "获取数据失败！";
		}

		return strRet;
	}

}
