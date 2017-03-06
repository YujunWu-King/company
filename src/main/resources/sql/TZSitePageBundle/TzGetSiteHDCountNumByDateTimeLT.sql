 select 
 	count(1) 
 from 
 	PS_TZ_LM_NR_GL_T PT2,  
 	PS_TZ_ART_REC_TBL PT3,  
 	PS_TZ_ART_HD_TBL PT4 
 where     
 	PT2.TZ_ART_ID = PT3.TZ_ART_ID 
 	and PT3.TZ_ART_ID = PT4.TZ_ART_ID  
 	and PT2.TZ_ART_PUB_STATE = 'Y' 
 	and PT2.TZ_SITE_ID = ? 
 	and concat(PT4.TZ_END_DT,' ', PT4.TZ_END_TM) < ?
 	and (
    	PT3.TZ_PROJECT_LIMIT<>'B' OR 
		EXISTS (SELECT 1 FROM PS_TZ_ART_AUDIENCE_T AUD 
			INNER JOIN PS_TZ_AUD_LIST_T LST ON(AUD.TZ_AUD_ID = LST.TZ_AUD_ID AND LST.OPRID=?
        ) WHERE AUD.TZ_ART_ID=PT4.TZ_ART_ID))