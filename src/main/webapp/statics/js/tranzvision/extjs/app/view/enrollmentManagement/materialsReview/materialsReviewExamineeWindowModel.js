Ext.define('KitchenSink.view.materialsReview.materialsReview.materialsReviewExamineeWindowModel',{
	extend: 'Ext.data.Model',
    field:[
    	{name:'classId'},
    	{name:'className'},
    	{name:'batchId'},
    	{name:'batchName'},
    	{name:'name'},
    	{name:'mssqh'},
    	{name:'appinsId'},
    	{name:'sex'},
    	{name:'sexDesc'},
    	{name:'judgeList'},
    	{name:'reviewStatusDesc'}
    ]
});