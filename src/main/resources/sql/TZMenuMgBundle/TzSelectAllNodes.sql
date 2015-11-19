select 
	a.TREE_NODE,
	a.TREE_NODE_NUM,
	a.TREE_NODE_NUM_END,
	a.PARENT_NODE_NAME,
	ifnull(b.TZ_MENU_MC,"") TZ_MENU_MC,
	b.TZ_YXX,
	b.TZ_COM_ID,
	b.TZ_MENU_LIMG,
	b.TZ_MENU_SIMG,
	b.TZ_MENU_NRID 
from 
	PSTREENODE a,
	PS_TZ_AQ_CDJD_TBL b 
where 
	a.TREE_NAME = b.TREE_NAME 
	and a.TREE_NODE=b.TZ_MENU_NUM 
	and a.TREE_NAME=? 
	and a.TREE_NODE in (
		select 
			TREE_NODE 
		from 
			PSTREENODE 
		where 
			TREE_NAME=? 
			and TREE_NODE_NUM>=? 
			and TREE_NODE_NUM_END<=?
	) 
order by  
	a.TREE_LEVEL_NUM asc,
	a.TREE_NODE_NUM desc