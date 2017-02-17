SELECT 
    TZ_CLASS_NAME, A.TZ_JG_ID, TZ_CS_SCOR_MD_ID, TREE_NAME
FROM
    PS_TZ_CLASS_INF_T A
        LEFT JOIN
    PS_TZ_RS_MODAL_TBL B ON A.TZ_JG_ID = B.TZ_JG_ID
        AND A.TZ_CS_SCOR_MD_ID = B.TZ_SCORE_MODAL_ID
WHERE
    A.TZ_CLASS_ID = ?