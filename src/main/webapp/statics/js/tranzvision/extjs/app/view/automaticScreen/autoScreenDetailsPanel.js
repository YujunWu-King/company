﻿Ext.define('KitchenSink.view.automaticScreen.autoScreenDetailsPanel', {
    extend: 'Ext.panel.Panel',
	requires: [
        'Ext.data.*',
        'Ext.util.*',
        'KitchenSink.view.automaticScreen.autoScreenController'
    ],
    xtype: 'autoScreenDetails',
	controller: 'autoScreenController',
	
	title: Ext.tzGetResourse("TZ_AUTO_SCREEN_COM.TZ_ZDCS_INFO_STD.autoScreenDetails","自动初筛详细信息"),
	bodyStyle:'overflow-y:auto;overflow-x:hidden',
	
	constructor: function(config){
		this.tzConfig = config;
		
		this.callParent();	
	},

    initComponent: function () {   
    	var config = this.tzConfig;
    	
    	var ksbqConfig = config;
    	ksbqConfig.queryType = "KSBQ";
    	
    	var fmqdConfig = config;
    	fmqdConfig.queryType = "FMQD";
    	
    	//考生自动标签store
		var ksbqStore = new KitchenSink.view.automaticScreen.autoTagOrFmListStore(ksbqConfig);
		//负面清单store
		var fmqdStore = new KitchenSink.view.automaticScreen.autoTagOrFmListStore(fmqdConfig);

    	//初筛结果Store
		var csStatusStore = Ext.create('Ext.data.Store', {
			 fields: [{
				 	name:'value'
			 	},{
			 		name:'descr'
			 	}],
             data: [{
            	 	value: 'Y', 
            	 	descr: '初筛通过'
             	},{
             		value: 'N', 
             		descr: '淘汰'
             	}]
		 });
    	
    	Ext.apply(this, {
    	   items: [{        
		        xtype: 'form',
		        reference: 'autoScreenDetailsForm',
				layout: {
					type: 'vbox',
					align: 'stretch'
		        },
		        border: false,
				bodyPadding: 10,
				bodyStyle:'overflow-y:auto;overflow-x:hidden',
		        
		        fieldDefaults: {
		            msgTarget: 'side',
		            labelWidth: 100,
		            labelStyle: 'font-weight:bold'
		        },
		        items: [{
		        	xtype:'hiddenfield',
		        	value:'classId'
		        },{
		        	xtype:'hiddenfield',
		        	value:'batchId'
		        },{
		            xtype: 'textfield',
					name: 'name',
					fieldLabel: '考生姓名',
					readOnly: true,
					cls: 'lanage_1'
		        },{
		        	xtype: 'textfield',
					name: 'applyNum',
					fieldLabel: '面试申请号',
					readOnly: true,
					cls: 'lanage_1'
		        },{
		        	xtype: 'textfield',
					name: 'appId',
					fieldLabel: '报名表编号',
					readOnly: true,
					cls: 'lanage_1'
		        },{
		        	xtype:'combo',
		        	name: 'status',
		        	fieldLabel: '初筛结果',
		        	store: csStatusStore,
		        	queryMode: 'local',
		            editable:false,
		            valueField: 'value',
		    		displayField: 'descr'
		        },{
		        	xtype: 'displayfield',
		        	name: 'ranking',
		        	fieldLabel: '考生排名'
		        },{
		        	xtype: 'tagfield',
		        	name: 'negativeList',
		        	fieldLabel: '负面清单',
		        	displayField: 'desc',
                    valueField: 'id',
                    queryMode: 'local',
		        },{
		        	xtype: 'tagfield',
		        	name: 'autoLabel',
		        	fieldLabel: '自动标签',
		        	displayField: 'desc',
                    valueField: 'id',
                    queryMode: 'local',
		        },{
		        	xtype: 'textfield',
		        	name: 'manualLabel',
		        	fieldLabel: '手工标签'
		        },{
		        	xtype: 'displayfield',
		        	name: 'updateOpr',
		        	fieldLabel: '修改人'
		        },{
		        	xtype: 'displayfield',
		        	name: 'updateDttm',
		        	fieldLabel: '修改时间'
		        }]
    	   }]
		});
	   
	 	this.callParent();
    },
	buttons: [{
		text: Ext.tzGetResourse("TZ_AUTO_SCREEN_COM.TZ_ZDCS_INFO_STD.save","保存"),
		iconCls:"save",
		handler: 'onAutoScreenDetailsSave'
	}, {
		text: Ext.tzGetResourse("TZ_AUTO_SCREEN_COM.TZ_ZDCS_INFO_STD.ensure","确定"),
		iconCls:"ensure",
		closePanel:'Y',
		handler: 'onAutoScreenDetailsEnsure'
	}, {
		text: Ext.tzGetResourse("TZ_AUTO_SCREEN_COM.TZ_ZDCS_INFO_STD.close","关闭"),
		iconCls:"close",
		handler: 'onAutoScreenDetailsClose'
	}]
})
