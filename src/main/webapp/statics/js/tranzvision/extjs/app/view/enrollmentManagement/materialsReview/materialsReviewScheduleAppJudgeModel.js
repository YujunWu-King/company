Ext.define('KitchenSink.view.enrollmentManagement.materialsReview.materialsReviewScheduleAppJudgeModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'classID'},
        {name: 'batchID'},
        {name: 'judgeRealName'},
        {name: 'appInsID'},
        {name: 'studentRealName'},
        {name:'score'}
    ]
});