﻿Ext.define('KitchenSink.view.judgesManagement.secretaryAccount.secretaryAccList', {
    extend: 'Ext.grid.Panel',
	requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.util.*',
        'Ext.toolbar.Paging',
        'Ext.ux.ProgressBarPager',
		'KitchenSink.view.judgesManagement.secretaryAccount.secretaryAccStore',
		'KitchenSink.view.judgesManagement.secretaryAccount.secretaryAccController',
		'KitchenSink.view.judgesManagement.secretaryAccount.secretaryAccInfoWin',
		'KitchenSink.view.judgesManagement.secretaryAccount.secretaryAccStore'
    ],
    xtype: 'secretaryAccountMg',
	controller: 'secretaryAccController',
    columnLines: true,
	style:"margin:8px", 
	selModel: {
       	type: 'checkboxmodel'
    },
    multiSelect: false,
    title: '面试秘书账号管理',
	header:false,
	frame: true,
    dockedItems:[
		{
			xtype:"toolbar",
			items:[
				{text:"查询",tooltip:"查询数据",iconCls: "query",handler:"searchSecretaryAcc"},'-',
				{text:"新增",tooltip:"新增数据",iconCls: "add",handler:"addNewSecretaryAcc"},'-',
				{text:"编辑",tooltip:"编辑数据",iconCls: "edit",handler:"editSelSecretaryAcc"},'-',
				{text:"删除",tooltip:"批量删除数据",iconCls: "remove",handler:"deleteSecretaryBat"}
			]
		},
		{
			xtype:"toolbar",
			dock:"bottom",
			ui:"footer",
			items:[
				'->',
				{minWidth:80,text:"保存",iconCls:"save",handler:"onSave"},
				{minWidth:80,text:"确定",iconCls:"ensure",handler:"onSure"},
				{minWidth:80,text:"关闭",iconCls:"close",handler:"onClose"}]
		}
	],
    initComponent: function () {    
		var store = new KitchenSink.view.judgesManagement.secretaryAccount.secretaryAccStore();
		
        Ext.apply(this, {
           columns: [{ 
               text: '机构ID',
               sortable: true,
               dataIndex: 'jgID',
				width: 200,
				hidden: true
           },{ 
                text: '用户账号',
                sortable: true,
                dataIndex: 'accountNo',
				width: 200
            },{
                text: '用户描述',
                sortable: true,
                dataIndex: 'judgeName',
                minWidth: 200,
				flex: 1
            },{
                text: '评委类型',
                sortable: true,
                dataIndex: 'judTypeDesc',
                minWidth: 150,
				flex: 1,
				hidden: true
            },{
               text: '操作',
			   menuDisabled: true,
               sortable: false,
			   draggable:false,
			   width:80,
			   align: 'center',
               xtype: 'actioncolumn',
			   items:[
			   			{
							text: '编辑',
							iconCls: 'edit',
							tooltip: '编辑',
                			handler: "editCurrRow"
						},
					  	{
							text: '删除',
							iconCls: 'remove',
							tooltip: '删除',
                    		handler: "deleteCurrRow"
						}
			   ]
             }],
			store:store,
			bbar: {
				xtype: 'pagingtoolbar',
				pageSize: 10,
				store:store,
				/*
				displayInfo: true,
				displayMsg: '显示{0}-{1}条，共{2}条',
				beforePageText: '第',
				afterPageText: '页/共{0}页',
				emptyMsg: '没有数据显示',
				*/
				plugins: new Ext.ux.ProgressBarPager()
			}	 
        });
		
        this.callParent();
    }
});