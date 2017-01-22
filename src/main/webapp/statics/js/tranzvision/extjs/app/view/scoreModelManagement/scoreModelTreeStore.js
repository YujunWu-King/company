Ext.define('KitchenSink.view.scoreModelManagement.scoreModelTreeStore', {
	extend: 'Ext.data.TreeStore',
    alias: 'store.scoreModelTreeStore',
    rootVisible: true,
    constructor: function(config) {
    	
        var me = this;
        var items;
        var root;
        
        var tzParams ='{"ComID":"TZ_SCORE_MOD_COM","PageID":"TZ_TREE_MG_STD","OperateType":"QF","comParams":{"treeName":"'+ config.treeName +'"}}';
	    Ext.tzLoadAsync(tzParams,function(respData){
           //树节点数据
            root = respData.root;
        });

	    /*
	    root = {
	    	text: '总分',
	    	itemId: 'total',
	    	id: 'total',
	    	expanded: true,
            children: [{
            	text: '英语',
    	    	itemId: 'eng',
    	    	id: 'eng',
    	    	expanded: false
            },{text: '数学',
    	    	itemId: 'mas',
    	    	id: 'mas',
    	    	expanded: false
    	    }]
	    }
	    */
	    
		items = root.children;

        me.callParent([Ext.apply({
            root: {
                text: root.text,
                itemId: root.itemId,
                id: root.itemId,
                expanded: root.expanded,
                children: items
            }
        }, config)]);
    }
});
