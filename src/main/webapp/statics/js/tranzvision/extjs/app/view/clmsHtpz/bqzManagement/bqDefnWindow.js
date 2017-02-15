﻿Ext.define('KitchenSink.view.clmsHtpz.bqzManagement.bqDefnWindow', {
    extend: 'Ext.window.Window',
    xtype: 'bqDefnWindow', 
    title: '标签定义', 
	reference: 'bqDefnWindow',
    width: 600,
    height: 520,
    minWidth: 300,
    minHeight: 380,
    layout: 'fit',
    resizable: true,
    modal: true,
    closeAction: 'destroy',
	actType: 'add',
	items: [{
		xtype: 'form',	
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		border: false,
		bodyPadding: 10,
		//heigth: 600,
	
		fieldDefaults: {
			msgTarget: 'side',
			labelWidth: 150,
			labelStyle: 'font-weight:bold'
		},
		items: [{
			xtype: 'textfield',
			fieldLabel: Ext.tzGetResourse("TZ_BIAOQZ_COM.TZ_BIAOQ_DEFN_STD.bqID","标签ID"),
			name: 'bqID',
			readOnly:'true'
		}, {
			xtype: 'textfield',
			fieldLabel: Ext.tzGetResourse("TZ_BIAOQZ_COM.TZ_BIAOQ_DEFN_STD.bqName","标签名称"),
			name: 'bqName'
		}, {
			xtype: 'textfield',
			fieldLabel: Ext.tzGetResourse("TZ_BIAOQZ_COM.TZ_BIAOQ_DEFN_STD.bqDesc","标签说明"),
			name: 'bqDesc'
		}, {
			xtype: 'textfield',
			fieldLabel: Ext.tzGetResourse("TZ_BIAOQZ_COM.TZ_BIAOQ_DEFN_STD.java","java类"),
			name: 'java'
		}]
	}],
    buttons: [{
		text: '保存',
		iconCls:"save",
		handler: 'onbqDefnSave'
	}, {
		text: '确定',
		iconCls:"ensure",
		handler: 'onbqDefnEnsure'
	}, {
		text: '关闭',
		iconCls:"close",
		handler: 'onbqDefnClose'
	}]
});
