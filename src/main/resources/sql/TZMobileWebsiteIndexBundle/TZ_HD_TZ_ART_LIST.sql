SELECT 
	B.TZ_COLU_ID,
	A.TZ_ART_ID,
	A.TZ_ART_TITLE,
	A.TZ_ART_TITLE_STYLE,
	DATE_FORMAT(A.TZ_DATE1,'%Y/%m/%d') AS TZ_DATE1, 
	case A.TZ_ART_TYPE1 when 'B' then A.TZ_OUT_ART_URL  else  B.TZ_ART_URL END TZ_ART_URL 
FROM PS_TZ_ART_REC_TBL A 
INNER JOIN PS_TZ_LM_NR_GL_T B 
	ON(A.TZ_ART_ID=B.TZ_ART_ID AND B.TZ_SITE_ID=? AND B.TZ_ART_PUB_STATE='Y' AND B.TZ_COLU_ID=?)
WHERE (A.TZ_PROJECT_LIMIT<>'B' OR 
		EXISTS (SELECT 1 FROM PS_TZ_ART_AUDIENCE_T AUD 
		INNER JOIN PS_TZ_AUD_LIST_T LST ON(AUD.TZ_AUD_ID = LST.TZ_AUD_ID AND LST.OPRID=?) 
		WHERE AUD.TZ_ART_ID=A.TZ_ART_ID))
ORDER BY B.TZ_MAX_ZD_SEQ DESC,B.TZ_ART_SEQ DESC,B.TZ_ART_NEWS_DT DESC limit ?,?

 