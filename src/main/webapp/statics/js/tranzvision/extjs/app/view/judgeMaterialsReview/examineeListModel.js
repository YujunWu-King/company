Ext.define('KitchenSink.view.judgeMaterialsReview.examineeListModel',{
	extend:'Ext.data.Model',
	fields:[
		{name:'classId'},
		{name:'applyBatchId'},
		{name:'examineeBmbId'},
		{name:'examineeName'},
		{name:'examineeRank'},
		{name:'examineeTotalScore'},
		{name:'examineeInterviewId'}
	]
});