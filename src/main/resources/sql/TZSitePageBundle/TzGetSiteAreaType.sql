select 
	distinct(TZ_AREA_TYPE) TZ_AREA_TYPE,
	TZ_AREA_TYPE_NAME 
from 
	PS_TZ_SITEI_ATYP_T 
where 
	TZ_SITEI_ID=? 
	and TZ_AREA_TYPE_STATE='Y'