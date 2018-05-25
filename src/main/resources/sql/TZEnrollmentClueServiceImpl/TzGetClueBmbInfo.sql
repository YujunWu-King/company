SELECT A.TZ_APP_INS_ID,
       (SELECT TZ_ZHZ_DMS FROM PS_TZ_PT_ZHZXX_TBL WHERE TZ_ZHZJH_ID='TZ_APPFORM_STATE' AND TZ_EFF_STATUS='A' AND TZ_ZHZ_ID=B.TZ_APP_FORM_STA) TZ_APP_FORM_STA,
       B.OPRID,
       B.TZ_REALNAME,
       B.TZ_MOBILE,
       B.TZ_EMAIL,
       B.TZ_CLASS_ID,
       B.TZ_CLASS_NAME,
       (SELECT TZ_ZHZ_DMS FROM PS_TZ_PT_ZHZXX_TBL where TZ_ZHZJH_ID='TZ_AUDIT_STATE' AND TZ_EFF_STATUS='A' AND TZ_ZHZ_ID=B.TZ_FORM_SP_STA) TZ_FORM_SP_STA 
FROM PS_TZ_XSXS_BMB_T A
     LEFT JOIN PS_TZ_CLUE_BMB_VW B 
	 ON A.TZ_APP_INS_ID=B.TZ_APP_INS_ID
WHERE A.TZ_LEAD_ID=?
