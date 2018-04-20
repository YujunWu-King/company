Ext.define('KitchenSink.view.clueManagement.clueManagement.audit.referenceLetterModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'oprID'},
        {name: 'appInsId'},
        {name: 'refLetterId'},
		{name: 'refLetterAppInsId'},
        {name: 'refLetterPerId'},
        {name: 'refLetterPerName'},
        {name: 'refLetterPerEmail'},
		{name: 'refLetterPerPhone'},
		{name: 'refLetterPerSex'},
		{name: 'refLetterSysFile'},
		{name: 'refLetterUserFile'},
		{name: 'refLetterState'},
		{name: 'refLetterAurl'},
		{name: 'refLetterPurl'}
	]
});
