SELECT 
	A.OPRID,
	B.TZ_DLZH_ID,
	B.TZ_REALNAME,
	B.TZ_MOBILE,
	B.TZ_EMAIL
FROM PS_TZ_JUSR_REL_TBL A
	LEFT JOIN PS_TZ_AQ_YHXX_TBL B
	ON A.OPRID=B.OPRID
WHERE 
	A.TZ_JG_ID=? AND A.TZ_JUGTYP_ID=?