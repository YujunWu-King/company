SELECT 
    A.TZ_LEAD_STATUS,
    (SELECT 
            M.TZ_ZHZ_DMS
        FROM
            PS_TZ_PT_ZHZXX_TBL M
        WHERE
            M.TZ_ZHZ_ID = A.TZ_LEAD_STATUS
                AND M.TZ_ZHZJH_ID = 'TZ_LEAD_STATUS') TZ_LEAD_STATUS_DESC,
    A.TZ_JY_GJ_RQ,
    A.TZ_THYY_ID,
    C.TZ_LABEL_NAME TZ_THYY_DESC,
    A.TZ_GBYY_ID,
    D.TZ_LABEL_NAME TZ_GBYY_DESC,
    A.TZ_COLOUR_SORT_ID,
    E.TZ_COLOUR_NAME,
    A.TZ_ZR_OPRID,
    B.TZ_REALNAME TZ_ZRR_NAME,
    A.TZ_KH_OPRID,
    A.TZ_REALNAME,
    A.TZ_COMP_CNAME,
    A.TZ_POSITION,
    A.TZ_MOBILE,
    A.TZ_PHONE,
    A.TZ_EMAIL,
    A.TZ_REFEREE_NAME,
    A.TZ_XSQU_ID,
    (SELECT 
            C.TZ_LABEL_DESC
        FROM
            PS_TZ_XSXS_DQBQ_T C
        WHERE
            A.TZ_XSQU_ID = C.TZ_LABEL_NAME) TZ_XSQU_DESC,
    A.TZ_BZ,
    IF(F.TZ_APP_INS_ID IS NOT NULL and F.TZ_APP_INS_ID > 0,
        'B',
        'A') TZ_BMR_STATUS,
    A.ROW_ADDED_DTTM,
    A.TZ_RSFCREATE_WAY,
    (SELECT 
            M.TZ_ZHZ_DMS
        FROM
            PS_TZ_PT_ZHZXX_TBL M
        WHERE
            M.TZ_ZHZ_ID = A.TZ_RSFCREATE_WAY
                AND M.TZ_ZHZJH_ID = 'TZ_RSFCREATE_WAY') TZ_RSFCREATE_WAY_DESC,
    IF(A.TZ_LEAD_STATUS = 'F',
        C.TZ_LABEL_NAME,
        IF(A.TZ_LEAD_STATUS = 'G',
            D.TZ_LABEL_NAME,
            '')) TZ_REASON,
    A.TZ_AGE,
    A.TZ_SEX,
    A.TZ_TJR,
    A.TZ_FDB,
    A.TZ_ZGXL,
    A.TZ_GZNX,
    A.TZ_GLNX
FROM
    PS_TZ_XSXS_INFO_T A
        LEFT JOIN
    PS_TZ_AQ_YHXX_TBL B ON A.TZ_ZR_OPRID = B.OPRID
        LEFT JOIN
    PS_TZ_THYY_XSGL_T C ON A.TZ_THYY_ID = C.TZ_THYY_ID
        LEFT JOIN
    PS_TZ_GBYY_XSGL_T D ON A.TZ_GBYY_ID = D.TZ_GBYY_ID
        LEFT JOIN
    PS_TZ_XSXS_XSLB_T E ON A.TZ_COLOUR_SORT_ID = E.TZ_COLOUR_SORT_ID
        LEFT JOIN
    PS_TZ_XSXS_BMB_T F ON A.TZ_LEAD_ID = F.TZ_LEAD_ID
WHERE
	A.TZ_LEAD_ID=?