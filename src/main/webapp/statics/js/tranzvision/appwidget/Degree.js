/*====================================================================
+ ���������������ı���ؼ����ɿ����ı�����ʾ��С�������ַ���Χ		++
+ �����ˣ�����														++
+ �������ڣ�2015-05-05												++
=====================================================================*/
SurveyBuild.extend("Degree", "baseComponent", {
    itemName: "ѧλ",
    title:"ѧλ",
    "StorageType":"S",
    option: {},
    _init: function(d, previewmode) {
        if ($.isEmptyObject(this.option)) {
            /*�����������ѡ��ֵ������ʼ��this.option*/
        } else {
            /*�����������ѡ��ֵ��ֱ�ӷ���*/
            return;
        }
		var degree = ["��ʿ",'˶ʿ','ѧʿ'];
        for (var i = 1; i <= 3; ++i) {
            this.option[d + i] = {
                code: i,
                txt: degree[i-1],
                orderby: i,
                defaultval: 'N',
                other: 'N',
                weight: 0
            }
        }
    },
    _getHtml: function(data, previewmode) {
        var c = "",e = "";
        if (previewmode) {
            if(SurveyBuild._readonly){
                //ֻ��ģʽ
                var valDesc = "";
                for (var i in data.option) {
                    if(data.value == data["option"][i]["code"]){
                        valDesc = data["option"][i]["txt"];
                    }
                }
                c += '<div class="main_inner_content_info_autoheight cLH">';
                c += '  <div class="main_inner_connent_info_left">';
                c += '      <span class="reg_title_star">' + (data.isRequire == "Y" ? "*": "") + '</span>' + data.title;
                c += '  </div>';
                c += '  <div class="main_inner_content_info_right" >' + valDesc + '</div>';
                c += '</div>'
            }else{
                //��дģʽ
                SurveyBuild.appInsId == "0" && this._getDefaultVal(data);
                e = '<option value="">' + MsgSet["PLEASE_SELECT"] + '</option>';
                for (var i in data.option) {
                    e += '<option ' + (data.value == data["option"][i]["code"] ? "selected='selected'": "") + 'value="' + data["option"][i]["code"] + '">' + data["option"][i]["txt"] + '</option>';
                }

                c += '<div class="main_inner_content_info_autoheight">';
                c += '  <div class="main_inner_connent_info_left">';
                c += '      <span class="reg_title_star">' + (data.isRequire == "Y" ? "*": "") + '</span>' + data.title;
                c += '  </div>';
                c += '  <div class="main_inner_content_info_right">';
                c += '      <div class="main_inner_content_info_right_option_251px">';
                c += '          <select name="' + data.itemId + '" class="chosen-select" id="' + data.itemId + '" style="width:251px;" title="' + data.itemName + '">';
                c +=                e;
                c += '          </select>';
                c += '      </div>';

                c += '      <div style="margin-top:-40px;margin-left:256px;float:left;">';
                c += '          <div id="' + data.itemId + 'Tip" class="onShow" style="margin: 0px; padding: 0px; background: transparent;">';
                c += '              <div class="onShow"></div>';
                c += '            </div>';
                c += '      </div>';
                c += '  </div>';
                c += '</div>'
            }
        } else {
            for (var i in data.option) {
                e += '<li id="s' + i + '">' + data["option"][i]["txt"] + '</li>';
            }
            c += '<div class="question-answer">';
            c += '  <b class="read-select"> - ��ѡ�� - </b>';
            c += '  <span class="suffix">' + (data["suffix"] ? data.suffix: "") + '</span>';
            c += '  <ul class="select-box">' + e + '</ul>';
            c += '</div>'
        }
        return c;
    },
    _edit: function(data) {
        var e = '',list = "";
		
        for (var i in data.option) {
            list += '<tr class="read-radio" data-id="' + data.instanceId + '-' + i + '">';
            list += '   <td>';
            list += '       <input type="checkbox" onchange="$(\'.defaultval\').not(this).prop(\'checked\',false);SurveyBuild.saveLevel1Attr(this,\'defaultval\')" class="defaultval" ' + (data["option"][i]["defaultval"] == "Y" ? "checked='checked'": "") + ' value="1">';
            list += '   </td>';
            list += '   <td>';
            list += '       <input type="text" onkeyup="SurveyBuild.saveLevel1Attr(this,\'code\')" value="' + data["option"][i]["code"] + '" oncontextmenu="return false;" ondragenter="return false" onpaste="return false" class="ocode">';
            list += '   </td>';
            list += '   <td>';
            list += '       <input type="text" onkeyup="SurveyBuild.saveLevel1Attr(this,\'txt\')" value="' + data["option"][i]["txt"] + '" oncontextmenu="return false;" ondragenter="return false" class="option-txt">';
            list += '   </td>';
            list += '   <td>';
            list += '       <a onclick="SurveyBuild.plusOption(this);return false;" class="text-success" href="javascript:void(0);"><i class="icon-plus-sign"></i> </a><a onclick="SurveyBuild.minusOption(this);return false;" class="text-warning" href="javascript:void(0);"><i class="icon-minus-sign"></i> </a><a href="javascript:void(0);" class="text-info option-move"><i class="icon-move"></i> </a>';
            list += '   </td>';
            list += '</tr>';
        }

        e += '<fieldset id="option-box">';
        e += '	<span class="edit_item_label titlewidth"><i class="icon-list-alt"></i> ��ѡֵ����</span>';
        e += '  <table class="table table-bordered data-table">';
        e += '       <thead>';
        e += '           <tr>';
        e += '               <th class="thw">Ĭ��</th>';
        e += '               <th>ֵ</th>';
        e += '               <th class="alLeft">����<button onclick="SurveyBuild.optionBatch(\'' + data.instanceId + '\')" class="btn btn-primary btn-mini pull-right">�����༭</button></th>';
        e += '               <th width="45">����</th>';
        e += '           </tr>';
        e += '       </thead>';
        e += '       <tbody class="ui-sortable">' + list + '</tbody>';
        e += '  </table>';
        e += '</fieldset>';

        e += '<div class="edit_item_warp">';
        e += '  <span class="edit_item_label">Ĭ��ֵ��</span>';
        e += '  <input type="text" class="medium" id="defaultval" onkeyup="SurveyBuild.saveAttr(this,\'defaultval\')" value="' + data.defaultval + '"/>';
        e += '</div>';

        e += '<div class="edit_item_warp" style="text-align:right;">';
        e += '  <a href="javascript:void(0);" onclick="SurveyBuild.DynamicBindVal()" class="">��̬��ֵ</a>';
        e += '</div>';

        e += '<div class="edit_jygz">';
        e += '	<span class="title"><i class="icon-cog"></i> У�����</span>';
		e += '  <div class="groupbox">';
        e += '  <div class="edit_item_warp" style="margin-top:5px;">';
        e += '      <input class="mbIE" type="checkbox" onchange="SurveyBuild.saveAttr(this,\'isRequire\')"' + (data.isRequire == "Y" ? "checked='checked'": "") + ' id="is_require"> <label for="is_require">�Ƿ����</label>';
        e += '  </div>';
		e += '  </div>';
		
        e += '  <div class="edit_item_warp">';
        e += '      <a href="javascript:void(0);" onclick="SurveyBuild.RulesSet(this);"><i class="icon-cogs"></i> �߼�����</a>';
        e += '  </div>';
        e += '</div>';
        return e;
    },
	
    _eventbind: function(data) {
        var $inputBox = $("#" + data.itemId);

		$inputBox.formValidator({tipID:(data["itemId"]+'Tip'), onShow:"", onFocus:"&nbsp;", onCorrect:"&nbsp;"});
		$inputBox.functionValidator({
			fun:function(val,elem){
				
				//ִ�и߼������е��Զ������
				/*********************************************\
				 ** ע�⣺�Զ�������в�Ҫʹ��formValidator **
				\*********************************************/
				var _result = true;
				if (ValidationRules) {
					$.each(data["rules"],function(classname, classObj) {
						//��ѡť����Ҫ�ڸ߼������еı�ѡ�ж�
						if ($.inArray(classname, SurveyBuild._baseRules) == -1 && data["rules"][classname]["isEnable"] == "Y") {
							var _ruleClass = ValidationRules[classname];
							if (_ruleClass && _ruleClass._Validator) {
								_result = _ruleClass._Validator(data["itemId"], classObj["messages"]);
								if(_result !== true){
									return false;
								}
							}
						}
					});
					if(_result !== true){
						return _result;
					}
				}
				return _result;
			}
		});
    }
});