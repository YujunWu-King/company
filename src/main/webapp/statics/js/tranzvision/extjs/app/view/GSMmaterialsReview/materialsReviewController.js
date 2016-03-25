﻿Ext.define('KitchenSink.view.GSMmaterialsReview.materialsReviewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.GSMmaterialsReview',
    queryClassBatch:function(btn){Ext.tzShowCFGSearch({
        cfgSrhId: 'TZ_REVIEW_CL_COM.TZ_CLPS_LIST_STD.TZ_CLS_BATCH_V',
        condition :{TZ_JG_ID:Ext.tzOrgID},
        callback: function(seachCfg){
            var store = btn.findParentByType("grid").store;
            store.tzStoreParams = seachCfg;
            store.load();
        }
    });
    },
    sendEmail: function(btn) {
        //是否有访问权限
        var pageResSet = TranzvisionMeikecityAdvanced.Boot.comRegResourseSet["TZ_REVIEW_CL_COM"]["TZ_CLPS_MAIL_STD"];
        if( pageResSet == "" || pageResSet == undefined){
            Ext.MessageBox.alert('提示', '您没有发送邮件的权限');
            return;
        }
        var grid=btn.findParentByType("form").child('grid');
        var store = grid.getStore();
        var modifiedRecs = store.getModifiedRecords();
        if(modifiedRecs.length>0){
            Ext.MessageBox.alert("提示","请先保存列表数据之后再发送邮件！");
            return;
        };

        var datas = grid.getSelectionModel().getSelection(),
            arr = [];
        if (datas.length==0){
            Ext.Msg.alert('提示','请选择发送邮件的评委');
            return;
        }
        for(var x=datas.length-1;x>=0;x--){
            arr.push(datas[x].data.judgeID);
        }
        var params = {
            ComID:"TZ_REVIEW_CL_COM",
            PageID:"TZ_CLPS_MAIL_STD",
            OperateType:"ReLis",
            comParams:{type:"ReLis",oprArr:arr}
        };
       // console.log(Ext.JSON.encode(params));
        Ext.Ajax.request({
            url:Ext.tzGetGeneralURL,
            params:{tzParams:Ext.JSON.encode(params)},
            success:function(responseData){
              //  console.log(responseData,responseData.responseText);
                var audID = Ext.JSON.decode(responseData.responseText).comContent;
               // console.log(Ext.JSON.decode(responseData.responseText));
                Ext.tzSendEmail({
                    //发送的邮件模板;
                    "EmailTmpName": ["TZ_CLPS_EMAIL"],
                    //创建的需要发送的听众ID;
                    "audienceId": audID,
                    //是否有附件: Y 表示可以发送附件,"N"表示无附件;
                    "file": "N"
                });
            }
        })
    },
    setReviewRule:function(grid,rowIndex){
        //是否有访问权限
        var pageResSet = TranzvisionMeikecityAdvanced.Boot.comRegResourseSet["TZ_REVIEW_CL_COM"]["TZ_CLPS_RULE_STD"];
        if( pageResSet == "" || pageResSet == undefined){
            Ext.MessageBox.alert('提示', '您没有修改数据的权限');
            return;
        }
        //该功能对应的JS类
        var className = pageResSet["jsClassName"];
        if(className == "" || className == undefined){
            Ext.MessageBox.alert('提示', '未找到该功能页面对应的JS类，页面ID为：TZ_CLPS_RULE_STD，请检查配置。');
            return;
        }
        var contentPanel, cmp, ViewClass, clsProto;

        contentPanel = Ext.getCmp('tranzvision-framework-content-panel');
        contentPanel.body.addCls('kitchensink-example');

        if(!Ext.ClassManager.isCreated(className)){
            Ext.syncRequire(className);
        }
        ViewClass = Ext.ClassManager.get(className);
        clsProto = ViewClass.prototype;

        if (clsProto.themes) {
            clsProto.themeInfo = clsProto.themes[themeName];

            if (themeName === 'gray') {
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.classic);
            } else if (themeName !== 'neptune' && themeName !== 'classic') {
                if (themeName === 'crisp-touch') {
                    clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes['neptune-touch']);
                }
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.neptune);
            }
            // <debug warn>
            // Sometimes we forget to include allowances for other themes, so issue a warning as a reminder.
            if (!clsProto.themeInfo) {
                Ext.log.warn ( 'Example \'' + className + '\' lacks a theme specification for the selected theme: \'' +
                    themeName + '\'. Is this intentional?');
            }
            // </debug>
        }

        var record = grid.store.getAt(rowIndex);
        var classID = record.data.classID;
        var batchID = record.data.batchID;
        cmp = new ViewClass();
        cmp.classID=classID;
        cmp.batchID=batchID;

        cmp.on('afterrender',function(panel){
            var form = panel.child('form').getForm();
            var countForm = panel.lookupReference("CountForm").getForm();

            var tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_RULE_STD",' +
                '"OperateType":"QF","comParams":{"classID":"'+classID+'","batchID":"'+batchID+'"}}';
            Ext.tzLoad(tzParams,function(respData){
                var formData = respData.formData;
                formData.batchName = record.data.batchName;
                formData.className = record.data.className;
                form.setValues(formData);

                countForm.findField("materialsReviewApplicantsNumber").setValue(formData.materialsReviewApplicantsNumber);
                countForm.findField("reviewCountAll").setValue(parseInt(formData.materialsReviewApplicantsNumber)*(formData.reviewCount));
              //  countForm.setValues(formData);
//                countForm.setValues({
//                    reviewCountAll:parseInt(formData.materialsReviewApplicantsNumber)*(formData.reviewCount)
//                });
            });
        });

        tab = contentPanel.add(cmp);

        contentPanel.setActiveTab(tab);

        Ext.resumeLayouts(true);

        if (cmp.floating) {
            cmp.show();
        }
    },
    viewApplicationForm : function(btn){
        //是否有访问权限
        var pageResSet = TranzvisionMeikecityAdvanced.Boot.comRegResourseSet["TZ_REVIEW_CL_COM"]["TZ_CLPS_APPS_STD"];
        if( pageResSet == "" || pageResSet == undefined){
            Ext.MessageBox.alert('提示', '您没有修改数据的权限');
            return;
        }
        //该功能对应的JS类
        var className = pageResSet["jsClassName"];
        //var className = 'KitchenSink.view.interviewManagement.interviewReview.interviewReviewApplicants';
        if(className == "" || className == undefined){
            Ext.MessageBox.alert('提示', '未找到该功能页面对应的JS类，页面ID为：TZ_CLPS_APPS_STD，请检查配置。');
            return;
        }
        var contentPanel, cmp, ViewClass, clsProto;

        contentPanel = Ext.getCmp('tranzvision-framework-content-panel');
        contentPanel.body.addCls('kitchensink-example');

        if(!Ext.ClassManager.isCreated(className)){
            Ext.syncRequire(className);
        }
        ViewClass = Ext.ClassManager.get(className);
        clsProto = ViewClass.prototype;

        if (clsProto.themes) {
            clsProto.themeInfo = clsProto.themes[themeName];

            if (themeName === 'gray') {
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.classic);
            } else if (themeName !== 'neptune' && themeName !== 'classic') {
                if (themeName === 'crisp-touch') {
                    clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes['neptune-touch']);
                }
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.neptune);
            }
            // <debug warn>
            // Sometimes we forget to include allowances for other themes, so issue a warning as a reminder.
            if (!clsProto.themeInfo) {
                Ext.log.warn ( 'Example \'' + className + '\' lacks a theme specification for the selected theme: \'' +
                    themeName + '\'. Is this intentional?');
            }
            // </debug>
        }


        var form = this.findCmpParent(btn.target).findParentByType('form').getForm(),
            classID = form.findField('classID').getValue(),
            batchID = form.findField('batchID').getValue(),
            className = form.findField('className').getValue(),
            batchName = form.findField('batchName').getValue();
        cmp = new ViewClass();
        cmp.classID=classID;
        cmp.batchID=batchID;

        cmp.on('afterrender',function(panel){
            var form = panel.child('form').getForm();

            var tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_APPS_STD",' +
                '"OperateType":"QF","comParams":{"classID":"'+classID+'","batchID":"'+batchID+'"}}';

            var tzStoreParams ='{"classID":"'+classID+'","batchID":"'+batchID+'"}';

            Ext.tzLoad(tzParams,function(respData){
                var formData = respData.formData;
                formData.className = className;
                formData.batchName = batchName;
                form.setValues(formData);
                var store = panel.child('form').child("grid").store;
                store.tzStoreParams = tzStoreParams;
                store.load();
            });
        });

        tab = contentPanel.add(cmp);

        contentPanel.setActiveTab(tab);

        Ext.resumeLayouts(true);

        if (cmp.floating) {
            cmp.show();
        }
    },
    findCmpParent : function(ele){
        //根据当前DOM节点，向上查找最近的包含EXT节点对象的节点并返回该EXT节点对象
        if(ele){
            while(!Ext.getCmp(ele.parentNode.id)){
                ele = ele.parentNode;
            }
            return Ext.getCmp(ele.parentNode.id);
        }else{
            return false;
        }
    },
    onReviewRuleSave:function(btn){
        var me =this;
        var form = this.getView().child("form").getForm();
        var grid= me.getView().lookupReference("materialsReviewJudgeGrid");
        //var store=grid.store;
        var store = grid.getStore();
        for (var i=0;i<store.getCount();i++){
            //var group=Ext.JSON.encode(store.getAt(i).get('judgeGroup').data);
            var group=store.getAt(i).get('judgeGroup');
            if (group=="")
            {
                if (store.getAt(i).get('judgeID')!=""){

                    i++;
                    var string1="第"+i+"行";
                    Ext.Msg.alert(string1,"评委组编号不可为空");
                    return;}
            }

        }
        if (form.isValid()) {
            var tzParams = this.getRuleParams();
            Ext.tzSubmit(tzParams,function(responseData){
                var grid = me.getView().lookupReference("materialsReviewJudgeGrid");
                var store = grid.getStore();
                if(tzParams.indexOf('"typeFlag":"JUDGE"')>-1||tzParams.indexOf("delete")>-1){
                    store.reload();
                }
            },"",true,this);
        }
    },
    onReviewRuleClose:function(btn){
        this.getView().close();
    },
    onReviewRuleEnsure: function(btn){
        var me =this;
        var form = this.getView().child("form").getForm();
        var grid= me.getView().lookupReference("materialsReviewJudgeGrid");
        var store = grid.getStore();
        for (var i=0;i<store.getCount();i++){
            //var group=Ext.JSON.encode(store.getAt(i).get('judgeGroup').data);
            var group=store.getAt(i).get('judgeGroup');
            if (group=="")
            {
                if (store.getAt(i).get('judgeID')!=""){

                    i++;
                    var string1="第"+i+"行";
                    Ext.Msg.alert(string1,"评委组编号不可为空");
                    return;}
            }

        }
        if (form.isValid()) {
            var tzParams = this.getRuleParams();
            var comView = this.getView();
            Ext.tzSubmit(tzParams,function(responseData){
                //关闭窗口
                comView.close();
            },"",true,this);
        }
    },
    getRuleParams:function(){
        var form = this.getView().child("form").getForm();
        var formParams = form.getValues();

        //更新操作参数
        var comParams = "";

        //修改json字符串
        var editJson = "";

        editJson = '{"typeFlag":"RULE","data":'+Ext.JSON.encode(formParams)+'}';

        var grid = this.getView().lookupReference("materialsReviewJudgeGrid");
        var store = grid.getStore();

        var editRecs = store.getModifiedRecords();
        for(var i=0;i<editRecs.length;i++){
            editJson = editJson + ','+'{"typeFlag":"JUDGE","data":'+Ext.JSON.encode(editRecs[i].data)+'}';
        }

        comParams = '"update":[' + editJson + "]";
        //删除json字符串
        var removeJson = "";
        //删除记录
        var removeRecs = store.getRemovedRecords();
        for(var i=0;i<removeRecs.length;i++){
            if(removeJson == ""){
                removeJson = Ext.JSON.encode(removeRecs[i].data);
            }else{
                removeJson = removeJson + ','+Ext.JSON.encode(removeRecs[i].data);
            }
        }
        if(removeJson != ""){
            if(comParams == ""){
                comParams = '"delete":[' + removeJson + "]";
            }else{
                comParams = comParams + ',"delete":[' + removeJson + "]";
            }
        }
        //提交参数
        var tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_RULE_STD","OperateType":"U","comParams":{'+comParams+'}}';
        return tzParams;
    },
    selectJudgeOprID:function(trigger){
        Ext.tzShowPromptSearch({
            recname: 'TZ_JUSR_REL_V',
            searchDesc: '选择评委',
            maxRow:20,
            condition:{
                presetFields:
                {
                    TZ_JG_ID:{
                        value:Ext.tzOrgID,
                        type:'01'
                    },
                    TZ_JUGTYP_ID:{
                        value:'001',
                        type:'01'
                    }
                },
                srhConFields:{
                    TZ_DLZH_ID:{
                        desc:'评委帐号',
                        operator:'07',
                        type:'01'
                    },
                    TZ_REALNAME:{
                        desc:'评委',
                        operator:'07',
                        type:'01'
                    }
                }
            },
            srhresult:{
                TZ_DLZH_ID: '评委帐号',
                TZ_REALNAME: '评委',
                TZ_JUGTYP_NAME:'评委类型'
            },
            multiselect: false,
            callback: function(selection){
                var oprID = selection[0].data.TZ_DLZH_ID;
                var oprName = selection[0].data.TZ_REALNAME;
                var form = trigger.findParentByType('form');
                form.getForm().findField("judgeID").setValue(oprID);
                form.getForm().findField("judgeName").setValue(oprName);
            }
        })
    },
    addJudge:function(btn){
        var self=this,
            form = btn.findParentByType("form").findParentByType("form").getForm(),
            grid=btn.findParentByType("form").child('grid');
            classID = form.findField("classID").getValue(),
            batchID = form.findField("batchID").getValue();
        var judgeGroupStore = new KitchenSink.view.common.store.comboxStore({
            recname:'TZ_PWZDY_T',
            condition:{
                TZ_JUGTYP_STAT:{
                    value:'Y',
                    operator:'01',
                    type:'01'
                }},
            result:'TZ_PWZBH,TZ_PWZMS'
        }),

            judgeStatusStore = new KitchenSink.view.common.store.appTransStore("TZ_JUGACC_STATUS");
        var win = Ext.create('Ext.window.Window',{
            title:'新增评委',
            width: 600,
            height: 365,
            modal:true,
            frame:true,
            items:[{
                xtype:'form',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 10,
                bodyStyle:'overflow-y:auto;overflow-x:hidden',

                fieldDefaults: {
                    msgTarget: 'side',
                    labelWidth: 110,
                    labelStyle: 'font-weight:bold'
                },
                items:[
                    {
                        xtype: 'textfield',
                        fieldLabel: '评委账号',
                        name: 'judgeID',
                        allowBlank: false,
                        editable:false,
                        triggers: {
                            search: {
                                cls: 'x-form-search-trigger',
                                handler:self.selectJudgeOprID
                            }
                        },
                        ignoreChangesFlag: true
                    },{
                        xtype:'textfield',
                        fieldLabel: '评委姓名',
                        name: 'judgeName',
                        allowBlank: false,
                        editable:false,
                        ignoreChangesFlag: true
                    },{
                        xtype:'combo',
                        fieldLabel: '账户状态',
                        name: 'judgeStatus',
                        allowBlank: false,
                        store:judgeStatusStore,
                        value:'A',
                        displayField:'TSDesc',
                        valueField:'TValue',
                        queryMode:'local',
                        renderer:function(v){
                            var x;
                            if((x = judgeStatusStore.find('TValue',v,0,false,false,false))>=0){
                                return judgeStatusStore.getAt(x).data.TSDesc;
                            }else{
                                return v;
                            }
                        },
                        editable:false,
                        ignoreChangesFlag: true

                    },{
                        fieldLabel: "所属评委组",
                        name: 'judgeGroup',
                        minWidth:100,
                        flex:1,
                        xtype:'combo',
                        store:judgeGroupStore,
                        displayField:'desc',
                        valueField:'group',
                        queryMode:'local',
                        editable:false,
                        afterLabelTextTpl: [
                            '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>'
                        ],
                        listeners:{
                            focus:function(combo){
                                var form = btn.findParentByType("form").getForm();
                                var reviewCount = form.findField("reviewCount").getValue();

                                var groupData = "";
                                for(var i=1;i<=reviewCount;i++){
                                    var groupID =String.fromCharCode(64+i);
                                    if(groupData==""){
                                        groupData=Ext.JSON.encode({group:groupID,desc:groupID})
                                    }else{
                                        groupData=groupData+","+Ext.JSON.encode({group:groupID,desc:groupID})
                                    }
                                }
                                groupData="["+groupData+"]";
                                combo.store.loadData(Ext.JSON.decode(groupData));
                            }
                        },
                        allowBlank: false,
                        ignoreChangesFlag: true
                    },{
                        xtype:'numberfield',
                        fieldLabel: '评审考生下限',
                        minValue:0,
                        name:'lower',
                        allowDecimals:false,
                        negativeText:'评审考生下限不能为负数',
                        vtypeText:'评审考生下限不能大于上限',
                        nanText:'{0}不是有效的数字',
                        value:0,
                        ignoreChangesFlag: true
                    },{xtype:'numberfield',
                        name:'upper',
                        fieldLabel: '评审考生上限',
                        minValue:0,
                        allowDecimals:false,
                        negativeText:'评审考生上限不能为负数',
                        vtypeText:'评审考生上限不能小于下限',
                        nanText:'{0}不是有效的数字',
                        value:0,
                        ignoreChangesFlag: true
                    }
                ]
                //items END
            }],
            buttons: [ {
                text: '确定',
                iconCls:"ensure",
                handler: function(btn){
                    var form = btn.findParentByType("panel").child("form").getForm(),
                        judgeID = form.findField("judgeID").getValue(),
                        judgeName = form.findField("judgeName").getValue(),
                        judgeStatus = form.findField("judgeStatus").getValue(),
                        judgeGroup = form.findField("judgeGroup").getValue(),
                        lower = form.findField("lower").getValue(),
                        upper = form.findField("upper").getValue();
                    if(lower>upper){
                        Ext.Msg.alert('提示','考生上限不可小于考生下限');
                        return;
                    }
                    if(form.findField("judgeID").isValid() && form.findField("judgeGroup").isValid()) {
                        if (grid.store.find('judgeID', judgeID, 0, false, false, true) == -1) {
                            var data = {classID: classID, batchID: batchID, judgeID: judgeID, judgeName: judgeName, judgeStatus: judgeStatus, judgeGroup: judgeGroup, lower: lower, upper: upper};
                            grid.getStore().insert(grid.getStore().length, data);
                            btn.findParentByType("panel").close();
                        } else {
                            Ext.Msg.alert("提示", "账号为“" + judgeID + "”的评委已经存在");
                            return false;
                        }
                    }
                }
            }, {
                text: '关闭',
                iconCls:"close",
                handler: function(btn){
                    btn.findParentByType("panel").close();
                }
            }]
        });
        win.show();
    },

    removeJudge:function(view,rowIndex){
        Ext.MessageBox.confirm('警告', '您确定要删除所选评委及与其相关的数据吗?', function(btnId){
            if(btnId == 'yes'){
                var store = view.store;
                store.removeAt(rowIndex);
            }
        },this);
    },
    editJudge:function(btn,rowIndex) {
        var grid= this.getView().lookupReference("materialsReviewJudgeGrid");
        var selList =  grid.getSelectionModel().getSelection();
        //选中行长度
        var checkLen = selList.length;
        if(checkLen == 0){
            Ext.Msg.alert("提示","请选择要编辑的记录");
            return;
        }
         if (checkLen>=2) {
                Ext.Msg.alert("提示", "请您仅选择一条记录进行编辑");
                return;
            } else{
             var form = btn.findParentByType("setMaterialsReviewRule").lookupReference("materialsReviewJudgeForm").getForm();
             var reviewCount = form.findField("reviewCount").getValue();
             var rec=selList[0];
             var judgeID=rec.data.judgeID,
                 judgeName=rec.data.judgeName,
                 judgeStatus=rec.data.judgeStatus,
                 judgeGroup=rec.data.judgeGroup,
                 upper=rec.data.upper,
                 lower=rec.data.lower;
             var judgeGroupStore = new Ext.data.Store({
                 fields:['group','desc'],
                 data:[]
             }),
             judgeStatusStore = new KitchenSink.view.common.store.appTransStore("TZ_JUGACC_STATUS");
             var win= Ext.create('Ext.window.Window', {
                 title:' 修改评委',
                 bodyPadding: 10,
                 frame: true,
                 width:750,
                 controller: 'materialsReview',
                 items: [
                     new Ext.form.Panel({
                         xtype:'form',
                         id:'judgeInfo',
                         reference: 'projectForm',
                         layout: {
                             type: 'vbox',
                             align: 'stretch'
                         },
                         border: false,
                         bodyPadding: 10,
                         //heigth: 600,
                         bodyStyle: 'overflow-y:auto;overflow-x:hidden',
                         fieldDefaults: {
                             msgTarget: 'side',
                             labelWidth: 120,
                             labelStyle: 'font-weight:bold'
                         },
                         items: [{
                             xtype: 'textfield',
                             fieldLabel: '评委账号',
                             name: 'judgeID',
                             value:judgeID,
                             editable:false,
                             ignoreChangesFlag: true
                         }, {
                             xtype: 'textfield',
                             fieldLabel: '评委',
                             name: 'judgeName',
                             allowBlank: false,
                             value:judgeName,
             editable:false,
                             ignoreChangesFlag: true
                         }, {
                             xtype:'combo',
                             fieldLabel: '账户状态',
                             name: 'judgeStatus',
                             allowBlank: false,
                             store:judgeStatusStore,
                             value:judgeStatus,
                             displayField:'TSDesc',
                             valueField:'TValue',
                             queryMode:'local',
                             renderer:function(v){
                                 var x;
                                 if((x = judgeStatusStore.find('TValue',v,0,false,false,false))>=0){
                                     return judgeStatusStore.getAt(x).data.TSDesc;
                                 }else{
                                     return v;
                                 }
                             },
                             editable:false,
                             ignoreChangesFlag: true


                         },{
                             fieldLabel: "所属评委组",
                             name: 'judgeGroup',
                             minWidth:100,
                             flex:1,
                             xtype:'combo',
                             store:judgeGroupStore,
                             displayField:'desc',
                             valueField:'group',
                             queryMode:'local',
                             editable:false,
                             listeners: {
                                 focus: function (combo) {
                                     var form = btn.findParentByType("form").getForm();
                                     var reviewCount = form.findField("reviewCount").getValue();

                                     var groupData = "";
                                     for (var i = 1; i <= reviewCount; i++) {
                                         var groupID = String.fromCharCode(64 + i);
                                         if (groupData == "") {
                                             groupData = Ext.JSON.encode({group: groupID, desc: groupID})
                                         } else {
                                             groupData = groupData + "," + Ext.JSON.encode({group: groupID, desc: groupID})
                                         }
                                     }
                                     groupData = "[" + groupData + "]";
                                     combo.store.loadData(Ext.JSON.decode(groupData));
                                 }
                             },
                             value:judgeGroup,
                             ignoreChangesFlag: true
                         },{
                             xtype:'numberfield',
                             fieldLabel: '评审考生下限',
                             minValue:0,
                             name:'lower',
                             allowDecimals:false,
                             negativeText:'评审考生下限不能为负数',
                             vtypeText:'评审考生下限不能大于上限',
                             nanText:'{0}不是有效的数字',
                             value:lower,
                             ignoreChangesFlag: true
                         },{xtype:'numberfield',
                             name:'upper',
                             fieldLabel: '评审考生上限',
                             minValue:0,
                             allowDecimals:false,
                             negativeText:'评审考生上限不能为负数',
                             vtypeText:'评审考生上限不能小于下限',
                             nanText:'{0}不是有效的数字',
                             value:upper,
                             ignoreChangesFlag: true
                         }]

                     })],  buttons:[{
                     text: '保存',handler:function(btn) {
                         var form = btn.findParentByType("panel").child("form").getForm(),
                             judgeStatus = form.findField("judgeStatus").getValue(),
                             judgeGroup = form.findField("judgeGroup").getValue(),
                             upper = form.findField("upper").getValue(),
                             lower = form.findField("lower").getValue();
                         if (lower > upper) {
                             Ext.Msg.alert('提示', '考生上限不可小于考生下限');
                             return;
                         }

                             selList[0].set("judgeStatus", judgeStatus);
                             selList[0].set("judgeGroup", judgeGroup);
                             selList[0].set("upper", upper);
                             selList[0].set("lower", lower);
                             btn.findParentByType("panel").close();
                         }


                 },{
                     text:'取消',handler:function(){
                         win.close();
                     }
                 }]
             });
             win.show();
            }
    },

    editCurrentJudge:function(btn,rowIndex) {
        var baseBtn = btn;
        var grid=baseBtn.findParentByType('grid'),
            rec = grid.getStore().getAt(rowIndex);
        var form = baseBtn.findParentByType("setMaterialsReviewRule").lookupReference("materialsReviewJudgeForm").getForm();
        var reviewCount = form.findField("reviewCount").getValue();
        var judgeID=rec.data.judgeID,
         judgeName=rec.data.judgeName,
        judgeStatus=rec.data.judgeStatus,
        judgeGroup=rec.data.judgeGroup,
        upper=rec.data.upper,
            lower=rec.data.lower;
        var judgeGroupStore = new Ext.data.Store({
            fields:['group','desc'],
            data:[]
        });
        var data = {
            judgeID:judgeID,
            judgeName:judgeName,
            judgeStatus:judgeStatus,
            judgeGroup: judgeGroup,
            upper: upper,
            lower: lower
        };

       var  judgeStatusStore = new KitchenSink.view.common.store.appTransStore("TZ_JUGACC_STATUS");

        var win= Ext.create('Ext.window.Window', {
            title:' 修改评委',
            bodyPadding: 10,
            frame: true,
            width:750,
            controller: 'materialsReview',
            items: [
                new Ext.form.Panel({
                    xtype:'form',
                    id:'judgeInfo',
                    reference: 'projectForm',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    border: false,
                    bodyPadding: 10,
                    //heigth: 600,
                    bodyStyle: 'overflow-y:auto;overflow-x:hidden',
                    fieldDefaults: {
                        msgTarget: 'side',
                        labelWidth: 120,
                        labelStyle: 'font-weight:bold'
                    },
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: '评委账号',
                        name: 'judgeID',
                       // value:judgeID,
                        editable:false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '评委',
                        name: 'judgeName',
                        allowBlank: false,
                       // value:judgeName,
                        editable:false
                    }, {
                        xtype:'combo',
                        fieldLabel: '账户状态',
                        name: 'judgeStatus',
                        allowBlank: false,
                        store:judgeStatusStore,
                        displayField:'TSDesc',
                        valueField:'TValue',
                        queryMode:'local',
                        renderer:function(v){
                            var x;
                            if((x = judgeStatusStore.find('TValue',v,0,false,false,false))>=0){
                                return judgeStatusStore.getAt(x).data.TSDesc;
                            }else{
                                return v;
                            }
                        },
                        editable:false,
                        ignoreChangesFlag: true

                    },{
                        fieldLabel: "所属评委组",
                        name: 'judgeGroup',
                        minWidth:100,
                        flex:1,
                        xtype:'combo',
                        store:judgeGroupStore,
                        displayField:'desc',
                        valueField:'group',
                        queryMode:'local',
                        editable:false,
                        listeners:{
                            focus:function(combo){
                                var form = btn.findParentByType("form").getForm();
                                var reviewCount = form.findField("reviewCount").getValue();

                                var groupData = "";
                                for(var i=1;i<=reviewCount;i++){
                                    var groupID =String.fromCharCode(64+i);
                                    if(groupData==""){
                                        groupData=Ext.JSON.encode({group:groupID,desc:groupID})
                                    }else{
                                        groupData=groupData+","+Ext.JSON.encode({group:groupID,desc:groupID})
                                    }
                                }
                                groupData="["+groupData+"]";
                                combo.store.loadData(Ext.JSON.decode(groupData));
                            }
                        },
                        ignoreChangesFlag: true
                    },{
                        xtype:'numberfield',
                        fieldLabel: '评审考生下限',
                       minValue:0,
                        name:'lower',
                        allowDecimals:false,
                        negativeText:'评审考生下限不能为负数',
                        vtypeText:'评审考生下限不能大于上限',
                        nanText:'{0}不是有效的数字',
                        ignoreChangesFlag: true
                    },{xtype:'numberfield',
                        name:'upper',
                        fieldLabel: '评审考生上限',
                        minValue:0,
                        allowDecimals:false,
                        negativeText:'评审考生上限不能为负数',
                        vtypeText:'评审考生上限不能小于下限',
                        nanText:'{0}不是有效的数字',
                        ignoreChangesFlag: true
                    }]

                })],  buttons:[{
                text: '确定',handler:function(btn){
                    var form = btn.findParentByType("panel").child("form").getForm(),
                        judgeStatus = form.findField("judgeStatus").getValue(),
                        judgeGroup = form.findField("judgeGroup").getValue(),
                        upper = form.findField("upper").getValue(),
                        lower = form.findField("lower").getValue();
                    if(lower>upper){
                        Ext.Msg.alert('提示','考生上限不可小于考生下限');
                        return;
                    }

                        grid.store.getAt(rowIndex).set("judgeStatus", judgeStatus);
                        grid.store.getAt(rowIndex).set("judgeGroup", judgeGroup);
                        grid.store.getAt(rowIndex).set("upper", upper);
                        grid.store.getAt(rowIndex).set("lower", lower);
                    btn.findParentByType("panel").close();

                }
            },{
                text:'取消',handler:function(){
                    win.close();
                }
            }]
        });
        Ext.getCmp('judgeInfo').getForm().setValues(data);
        win.show();
    },
    setAppJudge:function(btn,rowIndex){
        var grid= this.getView().lookupReference("materialsReviewApplicantsGrid");
            var modiefyGrid=grid.getStore().getModifiedRecords(),
            removeGrid=grid.getStore().getRemovedRecords();
        if (modiefyGrid!=0||removeGrid!=0)
        {
            Ext.Msg.alert('提示','请您先保存页面考生数据，再指定评委');
            return;
        }
        var form=btn.findParentByType('form').getForm();
        var classID = form.findField('classID').value;
        var batchID =form.findField('batchID').value;

        var pageResSet = TranzvisionMeikecityAdvanced.Boot.comRegResourseSet["TZ_REVIEW_CL_COM"]["TZ_CLPS_APPJUG_STD"];
        if( pageResSet == "" || pageResSet == undefined){
            Ext.MessageBox.alert('提示', '您没有修改数据的权限');
            return;
        }
//该功能对应的JS类
        var className = pageResSet["jsClassName"];
        if(className == "" || className == undefined){
            Ext.MessageBox.alert('提示', '未找到该功能页面对应的JS类，页面ID为：TZ_CLPS_APPJUG_STD，请检查配置。');
            return;
        }
        var contentPanel, cmp, ViewClass, clsProto;

        contentPanel = Ext.getCmp('tranzvision-framework-content-panel');
        contentPanel.body.addCls('kitchensink-example');

        if(!Ext.ClassManager.isCreated(className)){
            Ext.syncRequire(className);
        }
        ViewClass = Ext.ClassManager.get(className);
        clsProto = ViewClass.prototype;

        if (clsProto.themes) {
            clsProto.themeInfo = clsProto.themes[themeName];

            if (themeName === 'gray') {
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.classic);
            } else if (themeName !== 'neptune' && themeName !== 'classic') {
                if (themeName === 'crisp-touch') {
                    clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes['neptune-touch']);
                }
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.neptune);
            }
            // <debug warn>
            // Sometimes we forget to include allowances for other themes, so issue a warning as a reminder.
            if (!clsProto.themeInfo) {
                Ext.log.warn ( 'Example \'' + className + '\' lacks a theme specification for the selected theme: \'' +
                    themeName + '\'. Is this intentional?');
            }
            // </debug>

        }
        cmp = new ViewClass(
            appGrid=grid,
            appRowIndex=rowIndex
           );
        cmp.on('afterrender',function(win){
                var store = win.child('grid').getStore(),
                    tzStoreParams = '{"classID":"'+classID+'","batchID":"'+batchID+'"}';
                store.tzStoreParams = tzStoreParams;
                store.load();
//                store.filterBy(function(record) {
//                    return record.get('FirstTrialStatus') == "已通过";
//
//            var store = win.child('grid').getStore(),
//                tzStoreParams = '',
//                JSONData={},
//                form = Ext.getCmp('tranzvision-framework-content-panel').getActiveTab().child('form').getForm();
//            JSONData.appINSID = record.data.insID;
//            JSONData.classID = form.findField('classID').getValue();
//            JSONData.batchID = form.findField('batchID').getValue();
//            JSONData.judgeList=record.data.judgeInfo.split(',');
//            tzStoreParams = Ext.JSON.encode(JSONData);
//            store.tzStoreParams = tzStoreParams;
//            store.load();
        });
        cmp.show();
    },
    viewApplicants:function(grid,rowIndex){
        //是否有访问权限
        var pageResSet = TranzvisionMeikecityAdvanced.Boot.comRegResourseSet["TZ_REVIEW_CL_COM"]["TZ_CLPS_APPS_STD"];
        if( pageResSet == "" || pageResSet == undefined){
            Ext.MessageBox.alert('提示', '您没有修改数据的权限');
            return;
        }
        //该功能对应的JS类
        var className = pageResSet["jsClassName"];
        if(className == "" || className == undefined){
            Ext.MessageBox.alert('提示', '未找到该功能页面对应的JS类，页面ID为：TZ_CLPS_APPS_STD，请检查配置。');
            return;
        }
        var contentPanel, cmp, ViewClass, clsProto;

        contentPanel = Ext.getCmp('tranzvision-framework-content-panel');
        contentPanel.body.addCls('kitchensink-example');

        if(!Ext.ClassManager.isCreated(className)){
            Ext.syncRequire(className);
        }
        ViewClass = Ext.ClassManager.get(className);
        clsProto = ViewClass.prototype;

        if (clsProto.themes) {
            clsProto.themeInfo = clsProto.themes[themeName];

            if (themeName === 'gray') {
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.classic);
            } else if (themeName !== 'neptune' && themeName !== 'classic') {
                if (themeName === 'crisp-touch') {
                    clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes['neptune-touch']);
                }
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.neptune);
            }
            // <debug warn>
            // Sometimes we forget to include allowances for other themes, so issue a warning as a reminder.
            if (!clsProto.themeInfo) {
                Ext.log.warn ( 'Example \'' + className + '\' lacks a theme specification for the selected theme: \'' +
                    themeName + '\'. Is this intentional?');
            }
            // </debug>
        }

        var record = grid.store.getAt(rowIndex);
        var classID = record.data.classID;
        var batchID = record.data.batchID;
        cmp = new ViewClass();
        cmp.classID=classID;
        cmp.batchID=batchID;

//        cmp.on('afterrender',function(panel){
//            var form = panel.child('form').getForm();
//
//            var tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_APPS_STD",' +
//                '"OperateType":"QF","comParams":{"classID":"'+classID+'","batchID":"'+batchID+'"}}';
//
//            var tzStoreParams ='{"cfgSrhId": "TZ_REVIEW_CL_COM.TZ_CLPS_APPS_STD.TZ_CLPSKS_VW",' +
//                '"condition":{"TZ_CLASS_ID-operator":"01","TZ_CLASS_ID-value":"'+classID+'","TZ_APPLY_PC_ID-operator":"01","TZ_APPLY_PC_ID-value":"'+batchID+'"}}'
//
//            Ext.tzLoad(tzParams,function(respData){
//                var formData = respData.formData;
//                form.setValues(formData);
//                form.setValues(
//                    {className:record.data.className,batchName:record.data.batchName}
//                );
//                var store = panel.child('form').child("grid").store;
//                store.tzStoreParams = tzStoreParams;
//                store.load({
//                    scope: this,
//                    callback: function(records, operation, success) {
//                    }
//                });
//            });
//        }
        cmp.on('afterrender',function(panel){
            var form = panel.child('form').getForm();

            var tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_APPS_STD",' +
                '"OperateType":"QF","comParams":{"classID":"'+classID+'","batchID":"'+batchID+'"}}';


            var tzStoreParams ='{"classID":"'+classID+'","batchID":"'+batchID+'"}';

            Ext.tzLoad(tzParams,function(respData){
                var formData = respData.formData;

                formData.className = record.data.className;
                formData.batchName = record.data.batchName;

                form.setValues(formData);
                var store = panel.child('form').child("grid").store;
                store.tzStoreParams = tzStoreParams;
                store.load({
                    scope: this,
                    callback: function(records, operation, success) {
                    }
                });
            });
        });

        tab = contentPanel.add(cmp);

        contentPanel.setActiveTab(tab);

        Ext.resumeLayouts(true);

        if (cmp.floating) {
            cmp.show();
        }
    },
    queryApplicants:function(btn){
        var form = btn.findParentByType("form").getForm();
        var classID=form.findField("classID").getValue();
        var batchID=form.findField("batchID").getValue();

        Ext.tzShowCFGSearch({
            cfgSrhId: 'TZ_REVIEW_CL_COM.TZ_CLPS_APPS_STD.TZ_CLPS_KSH_V',
            condition :{"TZ_CLASS_ID":classID,"TZ_APPLY_PC_ID":batchID},
            callback: function(seachCfg){
                var store = btn.findParentByType("grid").store;
                store.tzStoreParams = seachCfg;
                store.load();
            }
        });
    },
    addApplicants : function(btn){
        var form=btn.findParentByType('form').getForm();
        var classID = form.findField('classID').value,
         batchID =form.findField('batchID').value,
         config = {type:'MaterialsStudent'};

        //是否有访问权限
        var pageResSet = TranzvisionMeikecityAdvanced.Boot.comRegResourseSet["TZ_REVIEW_CL_COM"]["TZ_CLPS_ADDAPP_STD"];
        if( pageResSet == "" || pageResSet == undefined){
            Ext.MessageBox.alert('提示', '您没有修改数据的权限');
            return;
        }
        //该功能对应的JS类
        var className = pageResSet["jsClassName"];
        if(className == "" || className == undefined){
            Ext.MessageBox.alert('提示', '未找到该功能页面对应的JS类，页面ID为：TZ_CLPS_ADDAPP_STD，请检查配置。');
            return;
        }
        var contentPanel, cmp, ViewClass, clsProto;

        contentPanel = Ext.getCmp('tranzvision-framework-content-panel');
        contentPanel.body.addCls('kitchensink-example');

        if(!Ext.ClassManager.isCreated(className)){
            Ext.syncRequire(className);
        }
        ViewClass = Ext.ClassManager.get(className);
        clsProto = ViewClass.prototype;

        if (clsProto.themes) {
            clsProto.themeInfo = clsProto.themes[themeName];

            if (themeName === 'gray') {
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.classic);
            } else if (themeName !== 'neptune' && themeName !== 'classic') {
                if (themeName === 'crisp-touch') {
                    clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes['neptune-touch']);
                }
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.neptune);
            }
            // <debug warn>
            // Sometimes we forget to include allowances for other themes, so issue a warning as a reminder.
            if (!clsProto.themeInfo) {
                Ext.log.warn ( 'Example \'' + className + '\' lacks a theme specification for the selected theme: \'' +
                    themeName + '\'. Is this intentional?');
            }
            // </debug>
        }
        //cmp = new ViewClass();
        cmp = new ViewClass();
        cmp.on('afterrender',function(win){
            var store = win.child('grid').getStore(),
                tzStoreParams = '{"type":"'+config.type+'","classID":"'+classID+'","batchID":"'+batchID+'"}';
            store.tzStoreParams = tzStoreParams;
            store.load();
           store.filterBy(function(record) {
            return record.get('FirstTrialStatus') == "已通过";
        });

        });

        cmp.show();

    },
    addApplicantsFromFiveGold:function(btn){
        var form=btn.findParentByType('form').getForm();
        var classID = form.findField('classID').value,
         batchID =form.findField('batchID').value,
                config = {type:'FiveGold'};

        //是否有访问权限
        var pageResSet = TranzvisionMeikecityAdvanced.Boot.comRegResourseSet["TZ_REVIEW_CL_COM"]["TZ_CLPS_ADDAPP_STD"];
        if( pageResSet == "" || pageResSet == undefined){
            Ext.MessageBox.alert('提示', '您没有修改数据的权限');
            return;
        }
        //该功能对应的JS类
        var className = pageResSet["jsClassName"];
        if(className == "" || className == undefined){
            Ext.MessageBox.alert('提示', '未找到该功能页面对应的JS类，页面ID为：TZ_CLPS_ADDAPP_STD，请检查配置。');
            return;
        }
        var contentPanel, cmp, ViewClass, clsProto;

        contentPanel = Ext.getCmp('tranzvision-framework-content-panel');
        contentPanel.body.addCls('kitchensink-example');

        if(!Ext.ClassManager.isCreated(className)){
            Ext.syncRequire(className);
        }
        ViewClass = Ext.ClassManager.get(className);
        clsProto = ViewClass.prototype;

        if (clsProto.themes) {
            clsProto.themeInfo = clsProto.themes[themeName];

            if (themeName === 'gray') {
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.classic);
            } else if (themeName !== 'neptune' && themeName !== 'classic') {
                if (themeName === 'crisp-touch') {
                    clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes['neptune-touch']);
                }
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.neptune);
            }
            // <debug warn>
            // Sometimes we forget to include allowances for other themes, so issue a warning as a reminder.
            if (!clsProto.themeInfo) {
                Ext.log.warn ( 'Example \'' + className + '\' lacks a theme specification for the selected theme: \'' +
                    themeName + '\'. Is this intentional?');
            }
            // </debug>
        }
        cmp = new ViewClass();
        cmp.on('afterrender',function(win){
            var store = win.child('grid').getStore(),
                tzStoreParams = '{"type":"'+config.type+'","classID":"'+classID+'","batchID":"'+batchID+'"}';
            store.tzStoreParams = tzStoreParams;
            store.load();
        });
        cmp.show();
},
    dumpTerm: function(btn){
      // btn.findParentByType("grid").filters.clearFilters(true);
       btn.findParentByType("grid").getStore().clearFilter();
        },
    addApplicantEnsure : function(btn,event){
        //由于新增弹出窗口会是当前页面不能操作，弹出窗口对应的tab即是当前活动的Tab
        var activeTab = Ext.getCmp('tranzvision-framework-content-panel').getActiveTab(),
            targetStore = activeTab.down("grid[name=materialsReviewApplicantsGrid]").getStore(),
            select = btn.findParentByType("panel").child('grid').getSelectionModel().getSelection();
        for(var x =0;x<select.length;x++){
            if(targetStore.find('appInsID',select[x].data.appInsID)<0) {
                var applicantModel = new KitchenSink.view.materialsReview.materialsReview.materialsReviewApplicantsModel({
                    classID:select[x].data.classID,
                    batchID:select[x].data.batchID,
                    realName:select[x].data.realName,
                    gender:select[x].data.gender,
                    appInsID:select[x].data.appInsID,
                    judgeList:"",
                    reviewStatus:"",
                    interviewQualification:"",
                    remark:"",
                    adminRemark:""
                });

                targetStore.add(applicantModel);
            }else{
               var isExist = true;
            }
            if(isExist){
                Ext.Msg.alert("提示","在您所选的记录中，有考生已经存在于名单中");
            }

        }
        var store=btn.findParentByType("panel").child('grid').getStore();
        console.log(store.getFilters());
        btn.findParentByType("panel").close();

    },

    addApplicantClose : function(btn){
        btn.findParentByType("panel").close();
    },
    editApplicants :function(btn,rowIndex){
        //获得选中行
        var selList =  btn.findParentByType("grid").getSelectionModel().getSelection();
        //选中行长度
        var checkLen = selList.length;
        if(checkLen == 0){
            Ext.Msg.alert("提示","请选择要编辑的记录");
            return;
        }
        if (checkLen>=2) {
            Ext.Msg.alert("提示", "请您仅选择一条记录进行编辑");
            return;
        } else{
            var form = btn.findParentByType("form").getForm(),
                grid = btn.findParentByType("grid"),
                classID = form.findField("classID").getValue(),
                batchID = form.findField("batchID").getValue(),
                datas =selList[0].data;
                if (datas.interviewQualification=="")
                {datas.interviewQualification="待定"}
            var judgeGroupStore = new KitchenSink.view.common.store.comboxStore({
                    recname:'TZ_PWZDY_T',
                    condition:{
                        TZ_JUGTYP_STAT:{
                            value:'Y',
                            operator:'01',
                            type:'01'
                        }},
                    result:'TZ_PWZBH,TZ_PWZMS'
                }),
                jugaccStatusStore = new KitchenSink.view.common.store.appTransStore("TZ_LUQU_ZT");
            var win = Ext.create('Ext.window.Window', {
                title: '编辑考生',
                width: 600,
                height: 325,
                modal: true,
                frame: true,
                items: [{
                    xtype: 'form',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    border: false,
                    bodyPadding: 10,
                    bodyStyle: 'overflow-y:auto;overflow-x:hidden',

                    fieldDefaults: {
                        msgTarget: 'side',
                        labelWidth: 110,
                        labelStyle: 'font-weight:bold'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: '姓名',
                            name: 'realName',
                            editable: false,
                            value:datas.realName,
                            ignoreChangesFlag: true
                        }, {
                            xtype: 'textfield',
                            fieldLabel: '报名表编号',
                            name: 'appInsID',
                            editable: false,
                            value:datas.appInsID,
                            ignoreChangesFlag: true
                        }, {
                            xtype: 'combo',
                            fieldLabel: "面试资格",
                            name: 'interviewQualification',
                            store: {
                                fields: ["status", "desc"],
                                data: [
                                    {status: 'Y', desc: '有'},
                                    {status: 'W', desc: '待定'},
                                    {status: 'N', desc: '无'}
                                ]
                            },
                            displayField: 'desc',
                            valueField: 'status',
                            queryMode: 'local',
                            editable: false,
                            value:datas.interviewQualification,
                            ignoreChangesFlag: true
                        },{
                            xtype:'textfield',
                            fieldLabel:'备注',
                            value:datas.remark,
                            name:'remark',
                            ignoreChangesFlag: true
                        },{
                            xtype:'textfield',
                            fieldLabel:'管理员意见',
                            value:datas.adminRemark,
                            name:'adminRemark',
                            ignoreChangesFlag: true
                        }
                    ]
                    //items END
                }],
                buttons: [{
                    text: '确定',
                    iconCls: "ensure",
                    handler: function (btn) {
                        var form = btn.findParentByType("panel").child("form").getForm(),
                            interviewQualification = form.findField("interviewQualification").getValue(),
                            remark = form.findField("remark").getValue(),
                            adminRemark = form.findField("adminRemark").getValue(),
                            record = selList[0];
                        record.set("interviewQualification",interviewQualification||'');
                        record.set("remark",remark||'');
                        record.set("adminRemark",adminRemark||'');
                        btn.findParentByType("panel").close();
                    }
                }, {
                    text: '关闭',
                    iconCls: "close",
                    handler: function (btn) {
                        btn.findParentByType("panel").close();
                    }
                }]
            });
            win.show();
        }
    },
    editCurrentApplicant:function(btn,rowIndex){
        var self=this,
            form = btn.findParentByType("grid").findParentByType("form").getForm(),
            grid = btn.findParentByType("grid"),
            classID = form.findField("classID").getValue(),
            batchID = form.findField("batchID").getValue(),
            datas = grid.getStore().getAt(rowIndex).data;
        var interviewQualification=datas.interviewQualification;
        if (interviewQualification=="")
        {  interviewQualification="W"}
        var judgeGroupStore = new KitchenSink.view.common.store.comboxStore({
                recname:'TZ_PWZDY_T',
                condition:{
                    TZ_JUGTYP_STAT:{
                        value:'Y',
                        operator:'01',
                        type:'01'
                    }},
                result:'TZ_PWZBH,TZ_PWZMS'
            }),
            jugaccStatusStore = new KitchenSink.view.common.store.appTransStore("TZ_LUQU_ZT");
        var win = Ext.create('Ext.window.Window', {
            title: '编辑考生',
            width: 600,
            height: 325,
            modal: true,
            frame: true,
            items: [{
                xtype: 'form',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 10,
                bodyStyle: 'overflow-y:auto;overflow-x:hidden',

                fieldDefaults: {
                    msgTarget: 'side',
                    labelWidth: 110,
                    labelStyle: 'font-weight:bold'
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: '姓名',
                        name: 'realName',
                        editable: false,
                        value:datas.realName,
                        ignoreChangesFlag: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: '报名表编号',
                        name: 'appInsID',
                        editable: false,
                        value:datas.appInsID,
                        ignoreChangesFlag: true
                    }, {
                        xtype: 'combo',
                        fieldLabel: "面试资格",
                        name: 'interviewQualification',
                        store: {
                            fields: ["status", "desc"],
                            data: [
                                {status: 'Y', desc: '有'},
                                {status: 'W', desc: '待定'},
                                {status: 'N', desc: '无'}
                            ]
                        },
                        displayField: 'desc',
                        valueField: 'status',
                        queryMode: 'local',
                        editable: false,
                        value:interviewQualification,
                        ignoreChangesFlag: true
                    },{
                        xtype:'textfield',
                        fieldLabel:'备注',
                        value:datas.remark,
                        name:'remark',
                        ignoreChangesFlag: true
                    },{
                        xtype:'textfield',
                        fieldLabel:'管理员意见',
                        value:datas.adminRemark,
                        name:'adminRemark',
                        ignoreChangesFlag: true
                    }
                ]
                //items END
            }],
            buttons: [{
                text: '确定',
                iconCls: "ensure",
                handler: function (btn) {
                    var form = btn.findParentByType("panel").child("form").getForm(),
                        interviewQualification = form.findField("interviewQualification").getValue(),
                        remark = form.findField("remark").getValue(),
                        adminRemark = form.findField("adminRemark").getValue();
                        console.log(interviewQualification);
                        record = grid.getStore().getAt(rowIndex);
                    record.set("interviewQualification",interviewQualification||'');
                    record.set("remark",remark||'');
                    record.set("adminRemark",adminRemark||'');
                    btn.findParentByType("panel").close();
                }
            }, {
                text: '关闭',
                iconCls: "close",
                handler: function (btn) {
                    btn.findParentByType("panel").close();
                }
            }]
        });
        win.show();
    },
    removeApplicants:function(btn){
        //选中行
        var selList =  btn.findParentByType("grid").getSelectionModel().getSelection();
        //选中行长度
        var resSetStore =  btn.findParentByType("grid").store;
        var checkLen = selList.length;
        if(checkLen == 0){
            Ext.Msg.alert("提示","请选择要删除的记录");
            return;
        }else{
            Ext.MessageBox.confirm('确认', '您确定要删除所选记录吗?', function(btnId){
                if(btnId == 'yes'){
//
                    for ( var i=0;i<checkLen;i++)
                    {
                        if (selList[i].data.judgeList!=0)
                    {Ext.Msg.alert('提示','选中考生中存在已被指定评委的考生，不可删除');}
                        else
                        {resSetStore.remove(selList[i]);}
                    }
       //           resSetStore.remove(selList);
//                    var resSetStore =  btn.findParentByType("grid").store;
//                    for (i=0;i<checkLen;i++){
//
//                    }
                }

            },"",true,this);
        }
    },
    setOwnQuary:function(btn){
        var win = Ext.create('Ext.window.Window', {
            title: '设置面试资格',
            width: 400,
            height: 150,
            modal: true,
            frame: true,
            items: [{
                xtype:'form',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                border: false,
                bodyPadding: 10,
                bodyStyle: 'overflow-y:auto;overflow-x:hidden',
                items:[{
                    xtype: 'combo',
                    fieldLabel: "面试资格",
                    name: 'interviewQualification',
                    store: {
                        fields: ["status", "desc"],
                        data: [
                            {status: 'Y', desc: '有'},
                            {status: 'W', desc: '待定'},
                            {status: 'N', desc: '无'}
                        ]
                    },
                    displayField: 'desc',
                    valueField: 'status',
                    queryMode: 'local',
                    editable: false,
                    ignoreChangesFlag: true
                }]

                //items END
            }],
            buttons: [{
                text: '确定',
                iconCls: "ensure",
                handler:function(btn){
                    var form = btn.findParentByType("window").child("form").getForm(),
                        interviewQualification = form.findField("interviewQualification").getValue();
                    for(var x = 0;x<selList.length;x++) {
                        selList[x].set('interviewQualification',interviewQualification);
                    }
                    btn.findParentByType("panel").close();
                }
            }, {
                text: '关闭',
                iconCls: "close",
                handler: function (btn) {
                    btn.findParentByType("panel").close();
                }
            }]
        });
        var selList =  btn.findParentByType("grid").getSelectionModel().getSelection(),
             store=btn.findParentByType("grid").getStore();
        if(selList.length == 0){
            Ext.Msg.alert("提示","请选择要操作的记录");
            return;
        }else{
            win.show();

        }
    },
    onApplicantsSave:function(btn){
        var store = btn.findParentByType('panel').down('grid[name=materialsReviewApplicantsGrid]').store;
        var me =this;
        var form = this.getView().child("form").getForm();


        if (form.isValid()) {
            var tzParams = this.getApplicantsParams();
            var comView = this.getView();

            Ext.tzSubmit(tzParams, function (responseData) {
                var grid = btn.findParentByType('panel').down("grid[name=materialsReviewApplicantsGrid]");
                var store = grid.getStore();
                if (tzParams.indexOf("add") > -1 || tzParams.indexOf("delete") > -1) {
                    store.reload();
                }

            }, "", true, this);
        }
    },

    onApplicantsClose:function(btn){
        this.getView().close();
    },
    onApplicantsEnsure: function(btn){
        var store = btn.findParentByType('panel').down('grid[name=materialsReviewApplicantsGrid]').store;
        var me =this;
        var form = this.getView().child("form").getForm();
        if (form.isValid()) {
            var tzParams = this.getApplicantsParams();
            var comView = this.getView();
            Ext.tzSubmit(tzParams,function(responseData){
                var grid = btn.findParentByType('panel').down("grid[name=materialsReviewApplicantsGrid]");
                var store = grid.getStore();
                if(tzParams.indexOf("delete")>-1){
                    store.reload();
                }
                comView.close()
                //btn.findParentByType('panel').close();
            },"",true,this);


        }
    },
    getApplicantsParams:function() {
        var form = this.getView().child("form").getForm();
        var grid = this.getView().lookupReference("materialsReviewApplicantsGrid");
        var store = grid.getStore(),
            storeNumber=store.getCount();
        form.findField('materialsReviewApplicantsNumber').setValue(storeNumber);
        var removedData = store.getRemovedRecords(),
            updateData = store.getModifiedRecords(),

            comParas,JSONData={},
            classID = form.findField('classID').getValue(),
            batchID =form.findField('batchID').getValue();
        //console.log(removedData,updateData,newData)

        if(removedData.length !== 0){
            JSONData.deleted = [];
            for(var x =removedData.length-1;x>=0;x--){
                JSONData.deleted[x] = {};
                JSONData.deleted[x].appInsID = removedData[x].data.appInsID;
                JSONData.deleted[x].classID = classID;
                JSONData.deleted[x].batchID = batchID;
            }
        }
        //更新数据
        if(updateData.length !== 0){
            JSONData.update =[];
            for(var x = updateData.length-1;x>=0;x--){
                JSONData.update[x] ={};
                delete updateData[x].data.id;
                JSONData.update[x].classID = classID;
                JSONData.update[x].batchID = batchID;
               // JSONData.update[x].batchID = updateData[x].data.batchID;
                JSONData.update[x].appInsID = updateData[x].data.appInsID;
                JSONData.update[x].judgeList = updateData[x].data.judgeList;
                JSONData.update[x].interviewQualification = updateData[x].data.interviewQualification;
                JSONData.update[x].reviewStatus = updateData[x].data.reviewStatus;
                JSONData.update[x].remark = updateData[x].data.remark;
                JSONData.update[x].adminRemark = updateData[x].data.adminRemark;
            }
        }
        comParas=Ext.JSON.encode(JSONData);
        //提交参数
        var tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_APPS_STD","OperateType":"U","comParams":' + comParas + '}';
        return tzParams;
    },

    /*评审进度管理*/
    reviewScheduleMg:function(grid,rowIndex){

        //是否有访问权限
        var pageResSet = TranzvisionMeikecityAdvanced.Boot.comRegResourseSet["TZ_REVIEW_CL_COM"]["TZ_CLPS_SCHE_STD"];
        if( pageResSet == "" || pageResSet == undefined){
            Ext.MessageBox.alert('提示', '您没有管理评审进度的权限');
            return;
        }
        //该功能对应的JS类
        var className = pageResSet["jsClassName"];
        if(className == "" || className == undefined){
            Ext.MessageBox.alert('提示', '未找到该功能页面对应的JS类，页面ID为：TZ_CLPS_SCHE_STD，请检查配置。');
            return;
        }
        var contentPanel, cmp, ViewClass, clsProto;

        contentPanel = Ext.getCmp('tranzvision-framework-content-panel');
        contentPanel.body.addCls('kitchensink-example');

        if(!Ext.ClassManager.isCreated(className)){
            Ext.syncRequire(className);
        }

        ViewClass = Ext.ClassManager.get(className);
        //ViewClass = new KitchenSink.view.materialsReview.materialsReview.materialsReviewSchedule();
        clsProto = ViewClass.prototype;

        if (clsProto.themes) {
            clsProto.themeInfo = clsProto.themes[themeName];

            if (themeName === 'gray') {
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.classic);
            } else if (themeName !== 'neptune' && themeName !== 'classic') {
                if (themeName === 'crisp-touch') {
                    clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes['neptune-touch']);
                }
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.neptune);
            }
            // <debug warn>
            // Sometimes we forget to include allowances for other themes, so issue a warning as a reminder.
            if (!clsProto.themeInfo) {
                Ext.log.warn ( 'Example \'' + className + '\' lacks a theme specification for the selected theme: \'' +
                    themeName + '\'. Is this intentional?');
            }
            // </debug>
        }

        var record = grid.store.getAt(rowIndex);
        var classID = record.get('classID');
        var batchID = record.get('batchID');
        cmp = new ViewClass(classID,batchID);

        cmp.on('afterrender',function(panel){
            var judgeStore =panel.down('tabpanel').child("form[name=judgeInfoForm]").child('grid').store,
                judgeParams = '{"type":"judgeInfo","classID":"'+classID+'","batchID":"'+batchID+'"}',
                form = panel.child('form').getForm();
            var stuListStore = panel.down('tabpanel').child('grid[name=materialsStudentGrid]').store,
                stuListParams = '{"type":"stuList","classID":"'+classID+'","batchID":"'+batchID+'"}';
            var tzParams ='{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_SCHE_STD",' +
                '"OperateType":"QF","comParams":{"classID":"'+classID+'","batchID":"'+batchID+'"}}';
            Ext.tzLoad(tzParams,function(respData){
                respData.className = record.data.className;
                respData.batchName = record.data.batchName;
               // form.setValues(respData.formData);
                form.findField('className').setValue(record.data.className);
                form.findField('batchName').setValue(record.data.batchName);
                form.setValues(respData);
                var formButton =panel.child('form');
                var btnStartNewReview=formButton.down('button[name=startNewReview]'),
                    btnCloseReview=formButton.down('button[name=closeReview]'),
                    btnReStartReview=formButton.down('button[name=reStartReview]');
                if(respData.status=='进行中'){
                    btnStartNewReview.flagType='positive';
                    btnCloseReview.flagtype='positive';
                    btnReStartReview.flagType='negative';
                    btnStartNewReview.setDisabled(true);
                    btnReStartReview.setDisabled(true);
                }
                 if(respData.status=='已关闭'){
                     btnStartNewReview.flagType='positive';
                     btnCloseReview.flagtype='negative';
                     btnReStartReview.flagType='positive';
                     btnCloseReview.setDisabled(true);
                 }
                if(respData.status=='未开始'){
                    btnStartNewReview.flagType='negative';
                    btnCloseReview.flagtype='negative';
                    btnReStartReview.flagType='positive';
                    btnCloseReview.setDisabled(true);
                }
                if(respData.delibCount==0){
                    btnStartNewReview.flagType='positive';
                    btnCloseReview.flagtype='negative';
                    btnReStartReview.flagType='negative';
                    btnCloseReview.setDisabled(true);
                    btnReStartReview.setDisabled(true);
                }
            });
            judgeStore.tzStoreParams = judgeParams;
            judgeStore.load();
            stuListStore.tzStoreParams = stuListParams;
        });

        tab = contentPanel.add(cmp);

        contentPanel.setActiveTab(tab);

        Ext.resumeLayouts(true);

        if (cmp.floating) {
            cmp.show();
        }
    },
    startNewReview:function(btn){
        // this.onScheduleSave;
        var form = btn.findParentByType('form'),
            classID=form.getForm().findField('classID').getValue(),
            batchID=form.getForm().findField('batchID').getValue(),
        delibCount =form.getForm().findField('delibCount').getValue();
        delibCount++;
        var datas = form.getForm().getValues(),
            isGuiFan=datas.strWaring;

        if (isGuiFan=="N")
        {
            alert("评审考生上限小于下限，请重新设置");
            return;
        }
        form.getForm().findField('delibCount').setValue(delibCount);
        var DQLC=delibCount;
        form.getForm().findField('status').setValue("进行中");
        if(btn.flagType === 'positive')
        {
            var tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_SCHE_STD","OperateType":"BUTTON","comParams":{"type":"reStartNewOnclick","classID":"' + classID + '","batchID":"' + batchID + '","delibCount":"' + DQLC + '"}}';
            Ext.tzLoad(tzParams, function (respData) {
            });
            //可点击状态,设置setType值为1,当前按钮已点击
            btn.setType = 1;
            //启动在可点击的情况下被点击后，设置关闭按钮为可点击状态,"",true,this);
           btn.setDisabled(true);
            var closeReviewButton=btn.findParentByType("form").down("button[name=closeReview]");
            closeReviewButton.setDisabled(false);
            closeReviewButton.setType = 0;
            closeReviewButton.flagType = 'positive';
            var reStartReviewButton=btn.findParentByType("form").down("button[name=reStartReview]");
            reStartReviewButton.setDisabled(true);
            reStartReviewButton.setType = 0;
            reStartReviewButton.flagType = 'negative';
        }
    },
    closeReview:function(btn){
        var form = btn.findParentByType('form'),
            datas = form.getForm().getValues();
        form.getForm().findField('status').setValue("已关闭");
        var classID=form.getForm().findField('classID').getValue(),
            batchID=form.getForm().findField('batchID').getValue(),
            delibCount=form.getForm().findField('delibCount').getValue();
        if(btn.flagType === 'positive'){
            //可点击状态，设置setType值为1,当前按钮已点击
            tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_SCHE_STD","OperateType":"BUTTON","comParams":{"type":"closeReviewOnclick","classID":"' + classID + '","batchID":"' + batchID + '","delibCount":"' + delibCount + '"}}';
            Ext.tzLoad(tzParams, function (respData) {
            });
            btn.setType = 1;
            //获取重新开始本轮评审按钮
            btn.setDisabled(true);
            btn.flagType = 'negative';
            var startNewReviewButton=btn.findParentByType("form").down("button[name=startNewReview]");
            startNewReviewButton.setDisabled(false);
            startNewReviewButton.setType = 0;
            startNewReviewButton.flagType = 'positive';
            var reStartReviewButton=btn.findParentByType("form").down("button[name=reStartReview]");
            reStartReviewButton.setDisabled(false);
            reStartReviewButton.setType = 0;
            reStartReviewButton.flagType = 'positive';

        }

    },
    reStartReview:function(btn){
        var form = btn.findParentByType('form'),
            datas = form.getForm().getValues();
        //progress="1/"+datas.totalStudents;
       // form.getForm().findField('progress').setValue(progress);
        form.getForm().findField('status').setValue("进行中");
        var classID=form.getForm().findField('classID').getValue(),
            batchID=form.getForm().findField('batchID').getValue(),
            delibCount=form.getForm().findField('delibCount').getValue();
        if(btn.flagType === 'positive'){
            tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_SCHE_STD","OperateType":"BUTTON","comParams":{"type":"reStartReviewOnclick","classID":"' + classID + '","batchID":"' + batchID + '","delibCount":"' + delibCount + '"}}';
            Ext.tzLoad(tzParams, function (respData) {
            });
            //可点击状态，设置setType值为1,当前按钮已点击
            btn.setType = 1;
            //获取重新开始本轮评审按钮
            btn.setDisabled(true);
            btn.flagType = 'negative';
            var closeReviewButton=btn.findParentByType("form").down("button[name=closeReview]");
            closeReviewButton.setDisabled(false);
            closeReviewButton.setType = 0;
            closeReviewButton.flagType = 'positive';
        }else{
            //不可点击状态
        }
    },
    viewJudge:function(grid,record,rowIndex){
        var gridData=grid.getStore().getAt(rowIndex).data;
        if(gridData.judgeInfo==""){
            return;
        }
        var pageResSet = TranzvisionMeikecityAdvanced.Boot.comRegResourseSet["TZ_REVIEW_CL_COM"]["TZ_CLPS_VWJUD_STD"];
        if( pageResSet == "" || pageResSet == undefined){
            Ext.MessageBox.alert('提示', '您没有修改数据的权限');
            return;
        }
//该功能对应的JS类
        var className = pageResSet["jsClassName"];
        if(className == "" || className == undefined){
            Ext.MessageBox.alert('提示', '未找到该功能页面对应的JS类，页面ID为：TZ_CLPS_VWJUD_STD，请检查配置。');
            return;
        }
        var contentPanel, cmp, ViewClass, clsProto;

        contentPanel = Ext.getCmp('tranzvision-framework-content-panel');
        contentPanel.body.addCls('kitchensink-example');

        if(!Ext.ClassManager.isCreated(className)){
            Ext.syncRequire(className);
        }
        ViewClass = Ext.ClassManager.get(className);
        clsProto = ViewClass.prototype;

        if (clsProto.themes) {
            clsProto.themeInfo = clsProto.themes[themeName];

            if (themeName === 'gray') {
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.classic);
            } else if (themeName !== 'neptune' && themeName !== 'classic') {
                if (themeName === 'crisp-touch') {
                    clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes['neptune-touch']);
                }
                clsProto.themeInfo = Ext.applyIf(clsProto.themeInfo || {}, clsProto.themes.neptune);
            }
            // <debug warn>
            // Sometimes we forget to include allowances for other themes, so issue a warning as a reminder.
            if (!clsProto.themeInfo) {
                Ext.log.warn ( 'Example \'' + className + '\' lacks a theme specification for the selected theme: \'' +
                    themeName + '\'. Is this intentional?');
            }
            // </debug>

        }


        cmp = new ViewClass();
       cmp.on('afterrender',function(win){
           var store = win.child('grid').getStore(),
               tzStoreParams = '',
               JSONData={},
                form = Ext.getCmp('tranzvision-framework-content-panel').getActiveTab().child('form').getForm();
               JSONData.appInsID = gridData.insID;
              JSONData.classID = form.findField('classID').getValue();
             JSONData.batchID = form.findField('batchID').getValue();
           JSONData.judgeList=gridData.judgeInfo.split(',');
           console.log(JSONData.judgeList);
            tzStoreParams = Ext.JSON.encode(JSONData);
           console.log(store);
         store.tzStoreParams = tzStoreParams;
           console.log(tzStoreParams);
     store.load();
        });
        cmp.show();
    },
    onScheduleSave : function(btn){
        var form = btn.findParentByType('panel').child('form'),
            datas = form.getForm().getValues();
        datas.delibCount=form.getForm().findField('delibCount').getValue()
      console.log(datas);
        //评委grid数据
            judgeFormValue = btn.findParentByType('panel').down("form[name=judgeInfoForm]").getForm().findField('reviewCount').value,
            judgeGrid = btn.findParentByType('panel').down("grid[name=materialsJudgeGrid]"),
            judgeModified = judgeGrid.getStore().getModifiedRecords(),
        //考生grid数据
            stuGrid = btn.findParentByType('panel').down("grid[name=materialsStudentGrid]"),
            stuModified = stuGrid.getStore().getModifiedRecords(),
        //按钮
            startNewReviewBtn = form.down("button[name=startNewReview]"),
            closeReviewBtn = form.down("button[name=closeReview]"),
            reStartReviewBtn = form.down("button[name=reStartReview]");
        //处理按钮样式
        //目前的逻辑，只有在点击启动后，结束按钮变为可用，所以只尝试修改结束按钮的样式

        //删除不需要想后台传输的数据
        delete datas.batchName;
        delete datas.className;
        delete datas.totalStudents;
        delete datas.materialStudents;
        //delete datas.delibCount;
        delete datas.progress;
        delete datas.reviewCount;//每位考生被多少位评委审批
        //数字文本框中的数字
        if(judgeFormValue){
            datas.reviewCount = judgeFormValue.toString();
        }

        //获取各个按钮的点击状态
        datas.startNewReviewClicked = form.down('button[name=startNewReview]').setType.toString();
        datas.closeReviewClicked = form.down('button[name=closeReview]').setType.toString();
        datas.reStartReviewClicked = form.down('button[name=reStartReview]').setType.toString();
        //评委信息grid的修改项
        if(judgeModified.length !== 0){
            datas.judgeInfoUpdate = [];
            for(var x =judgeModified.length-1;x>=0;x--){
                var thisdata = judgeModified[x].data;
                //删除不需要的数据
                delete thisdata.id;
                delete thisdata.classID;
                delete thisdata.batchID;
                datas.judgeInfoUpdate.push(thisdata);
            }
        }
        //获取考生表单中更新了的评委间偏差信息
        if(stuModified.length !==0){
            datas.studentInfo = [];
            for(var x = stuModified.length-1;x>=0;x--){
                var thisdata = {};
                thisdata.pweiPC = stuModified[x].data.judgePC;
                thisdata.appInsId = stuModified[x].data.insID;
                datas.studentInfo.push(thisdata);
            }
        }
        var result = {update:[datas]},
            comParams = Ext.JSON.encode(result),
            tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_SCHE_STD","OperateType":"U","comParams":'+comParams+'}';
        Ext.tzSubmit(tzParams,function(responseData) {
            judgeGrid.store.reload();
            stuGrid.store.reload();
        },"",true,this);
    },
    onScheduleEnsure : function(btn){
        var form = btn.findParentByType('panel').child('form'),
            datas = form.getForm().getValues(),
            judgeGrid = btn.findParentByType('panel').down("grid[name=materialsJudgeGrid]"),
            judgeModified = judgeGrid.getStore().getModifiedRecords(),
            judgeFormValue = btn.findParentByType('panel').down("form[name=judgeInfoForm]").getForm().findField('reviewCount').value,
            stuGrid = btn.findParentByType('panel').down("grid[name=materialsStudentGrid]"),
            stuModified = stuGrid.getStore().getModifiedRecords();
        //删除不需要想后台传输的数据
        delete datas.batchName;
        delete datas.className;
        delete datas.totalStudents;
        delete datas.materialStudents;
        //delete datas.delibCount;
        delete datas.progress;
        delete datas.reviewCount;//每位考生被多少位评委审批
        //数字文本框中的数字
        if(judgeFormValue){
            datas.judgeCount = judgeFormValue.toString();
        }
        //获取各个按钮的点击状态
        datas.startNewReviewClicked = form.down('button[name=startNewReview]').setType.toString();
        datas.closeReviewClicked = form.down('button[name=closeReview]').setType.toString();
        datas.reStartReviewClicked = form.down('button[name=reStartReview]').setType.toString();
        //评委信息grid的修改项
        if(judgeModified.length !== 0){
            datas.judgeInfoUpdate = [];
            for(var x =judgeModified.length-1;x>=0;x--){
                var thisdata = judgeModified[x].data;
                //删除不需要的数据
                delete thisdata.id;
                delete thisdata.classID;
                delete thisdata.batchID;
                datas.judgeInfoUpdate.push(thisdata);
            }
        }
        //获取考生表单中更新了的评委间偏差信息
        if(stuModified.length !==0){
            datas.studentInfo = [];
            for(var x = stuModified.length-1;x>=0;x--){
                var thisdata = {};
                thisdata.pweiPC = stuModified.judgePC;
                thisdata.appInsId = stuModified.insID;
                datas.studentInfo.push(thisdata);
            }
        }
        var result = {update:[datas]},
            comParams = Ext.JSON.encode(result);
        tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_SCHE_STD","OperateType":"U","comParams":'+comParams+'}';
        Ext.tzSubmit(tzParams,function(responseData) {
            var panel = btn.findParentByType('panel');
            panel.close();
        },"",true,this);
    },
    onScheduleClose : function(btn){
        var panel = btn.findParentByType('panel');
        panel.close();
    },
    judgeInfoController : function(btn,arr){
        var selList =  btn.findParentByType("grid").getSelectionModel();
        if(selList.getSelection().length == 0){
            Ext.Msg.alert("提示","请选择要操作的记录");
            return;
        }else{
            for(var x = 0;x<selList.getSelection().length;x++) {
                var select = btn.findParentByType("grid").getSelection(),
                    index = btn.findParentByType("grid").getStore().indexOf(select[x]),
                    record = btn.findParentByType("grid").getStore().getAt(index);
                for(var y = arr.length-1;y>=0;y--){
                    record.set(arr[y].name,arr[y].value);
                }
            }
        }

    },
    pause : function(btn){
        this.judgeInfoController(btn,[{name:'accountStatus',value:'B'}]);
    },
    submitData : function(btn){
        var selection = btn.findParentByType('grid').getSelectionModel().getSelection();
        // data[0].value = str.replace(/\/\d+$/,'/'+str.match(/^(\d+)\//)[1]);
        for(var x = selection.length-1;x>=0;x--) {
            var select = btn.findParentByType("grid").getSelection(),
                index = btn.findParentByType("grid").getStore().indexOf(select[x]),
                record = btn.findParentByType("grid").getStore().getAt(index);
            str = selection[x].data.hasSubmited;
            if (str.match(/^\d+\//)[0].replace(/\//, '') == str.match(/\/\d+$/)[0].replace(/\//, '') && !str.match(/^0\//)) {
                //抽取数量与已提交的数量相同同时抽取数量不为空=>当前评委抽取的所有考生都已评审
                //btn.findParentByType('grid').getSelectionModel().getSelection()[0].data.isChange = 'submit';
                record.set('submitYN','Y');
            }else{
                Ext.Msg.alert("提示","在您选择提交数据的评委中，存在未完成所有考生评审的评委");
                record.set('submitYN','N');
            }
        }

    },
    setNoSubmit : function(btn){
        this.judgeInfoController(btn,[{name:'submitYN',value:'N'}]);

    },
    revokeData : function(btn){
        Ext.Msg.confirm('警告','撤销面试数据会将该评委的所有数据都撤销，该操作不可恢复，是否继续？',function(e) {
            if (e === 'yes') {
                var str = btn.findParentByType('grid').getSelectionModel().getSelection(),
                    JSONData = [];
                for (var x = 0; x < str.length; x++) {
                    var select = btn.findParentByType("grid").getSelection(),
                        index = btn.findParentByType("grid").getStore().indexOf(select[x]),
                        record = btn.findParentByType("grid").getStore().getAt(index);
                    JSONData[x] = {};
                    JSONData[x].classID = record.data.classID;
                    JSONData[x].batchID = record.data.batchID;
                    JSONData[x].judgeID = record.data.judgeID;
                }
                var tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_SCHE_STD","OperateType":"revoke","comParams":{"type":"revoke","remove":'+Ext.JSON.encode(JSONData)+'}}';
                Ext.tzSubmit(tzParams,function(responseData) {
                    btn.findParentByType('grid').getStore().reload();
                },"成功删除",true,this);
            }
        } );
    },
    printChart: function(btn){
        //Ext.tzSetCompResourses("TZ_ONLINE_REG_COM");

      var judgeGrid=btn.findParentByType('grid'),
       selList = judgeGrid.getSelectionModel().getSelection();
       var form=judgeGrid.findParentByType('form').findParentByType('form').getForm();
        console.log(form.findField("delibCount"));
        //选中行长度
        var checkLen = selList.length;
        if(checkLen == 0){
            Ext.Msg.alert("提示","请选择要打印总分表的记录");
            return;
        }
        else {
          //拼装评委信息
            var JudgeJson="";
            var classID=selList[0].data.classID,
                batchID=selList[0].data.batchID,
                DQLC=form.findField("delibCount").getValue();
            console.log(selList[0].data.judgeID);
            if (selList.length==1){
                var JudgeJson= '"' + selList[0].data.judgeID + '"';
                console.log(JudgeJson);
            }
      else{
                for (var i=0;i<selList.length-1;i++)
                {
                    if(JudgeJson=="")
                    {
                        JudgeJson= '"' + selList[i].data.judgeID;}
                    else{JudgeJson=JudgeJson+','+selList[i].data.judgeID}
                }
               JudgeJson=JudgeJson+','+selList[selList.length-1].data.judgeID+'"';
                }
           var comParams = '"PWARRAY":' + JudgeJson ;


            var tzParams = '{"ComID":"TZ_CLMSPS_PF","PageID":"TZ_PF_STD","OperateType":"HTML","comParams":{"PF_TYPE":"CL","classID":"' + classID + '","batchID":"' + batchID + '","DQLC":"' + DQLC + '",' + comParams + '}}';

                var viewUrl =Ext.tzGetGeneralURL()+"?tzParams="+tzParams;

                window.open(viewUrl, "下载","status=no,menubar=yes,toolbar=no,location=no");


        }
    },

    judgeStatusChange : function(combo,record){
        if(record.data.status === 'Y'){
            var select = combo.findParentByType("grid").getSelection(),
                index = combo.findParentByType("grid").getStore().indexOf(select[0]),
                record = combo.findParentByType("grid").getStore().getAt(index),
                schedule = select[0].data.hasSubmited;
            if(schedule.match(/^\d+\//)[0].replace(/\//, '') !== schedule.match(/\/\d+$/)[0].replace(/\//, '') || schedule.match(/^0\//)){
                //抽取数量与已提交的数量相同同时抽取数量不为空=>当前评委抽取的所有考生都已评审
                Ext.Msg.alert("提示","在您选择提交数据的评委中，存在未完成所有考生评审的评委");
                record.set('submitYN','N');
            }

        }
    },
    calDeviation : function(btn){
        var select = btn.findParentByType("grid").getSelection(),
            classID = btn.findParentByType("grid").findParentByType("form").getValues().classID,
            batchID = btn.findParentByType("grid").findParentByType("form").getValues().batchID,
            datas={};
        if(select.length == 0) {
            Ext.Msg.alert("提示", "请您选择要操作的记录");
            return;
        }else{
            datas.type = 'calculate';
            datas.classID = classID;
            datas.batchID = batchID;
            datas.appID =[];
            for(var x = 0;x<select.length;x++){
                datas.appID.push(select[x].data.insID);
            }
            var tzParams = '{"ComID":"TZ_REVIEW_CL_COM","PageID":"TZ_CLPS_SCHE_STD","OperateType":"CA","comParams":' + Ext.JSON.encode(datas) + '}';
            Ext.tzLoad(tzParams, function (responseData) {
                for(var x=select.length-1;x>=0;x--) {
                    var index = btn.findParentByType("grid").getStore().indexOf(select[x]),
                        record = btn.findParentByType("grid").getStore().getAt(index);
                    for(var y=responseData.root.length-1;y>=0;y--){
                        if(responseData.root[y].appInsID === record.data.insID){
                            record.set('judgePC',responseData.root[y].standardDeviation);
                        }
                    }
                }
            });
        }
    },
    stuListActive : function(grid){
        var stuListStore = grid.getStore(),
            classID = grid.findParentByType("form").getValues().classID,
            batchID = grid.findParentByType("form").getValues().batchID;

        stuListStore.load();
    },
    selectOprForStudent : function(trigger){
        var classID = trigger.findParentByType('grid').findParentByType('form').getForm().findField('classID').value;
        Ext.tzShowPromptSearch({
            recname: 'TZ_CLPS_PW_VW',
            searchDesc: '选择评委',
            maxRow:20,
            condition:{
                presetFields:
                {
                    TZ_JG_ID:{
                        value:Ext.tzOrgID,
                        type:'01'
                    },
                    TZ_CLASS_ID:{
                        value:classID,
                        type:'01'
                    }
                },
                srhConFields:{
                    TZ_DLZH_ID:{
                        desc:'评委帐号',
                        operator:'07',
                        type:'01'
                    },
                    TZ_REALNAME:{
                        desc:'评委姓名',
                        operator:'07',
                        type:'01'
                    }
                }
            },
            srhresult:{
                TZ_DLZH_ID: '评委帐号',
                TZ_REALNAME: '评委姓名',
                TZ_JUGTYP_NAME:'评委类型'
            },
            multiselect: false,
            callback: function(selection) {
                var oprID = selection[0].data.TZ_DLZH_ID,
                    select = trigger.findParentByType('grid').getSelectionModel().getSelection(),
                    index = trigger.findParentByType("grid").getStore().indexOf(select[0]),
                    record = trigger.findParentByType("grid").getStore().getAt(index);
                if(trigger.value.indexOf(oprID) == -1){
                    if(trigger.value != '') {
                        record.set('judgeInfo', trigger.value + "," + oprID);
                    }else{
                        record.set('judgeInfo',oprID);
                    }
                }else{
                    Ext.Msg.alert('提示','当前评委已存在该考生的已指定的评委列表中');
                }
            }
        })
    }

});
