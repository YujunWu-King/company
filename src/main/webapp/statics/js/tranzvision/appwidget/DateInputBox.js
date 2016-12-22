SurveyBuild.extend("DateInputBox", "SingleTextBox", {
	itemName: "日期",
	title: "日期",
	dateformate: "yy-mm-dd",
	"StorageType": "S",
	minYear: "1960",
	maxYear: "2030",

	_getHtml: function(data, previewmode) {
		var c = "";
		if (previewmode) {
			if (SurveyBuild._readonly) {
				//只读模式
				c += '<div class="input-list">';
				c += '	<div class="input-list-info left"><span class="red-star">' + (data.isRequire == "Y" ? "*": "") + '</span>' + data.title + '</div>';
				c += '  <div class="input-list-text left">' + data.value + '</div>';
				c += '  <div class="input-list-suffix left"></div>';
				c += '  <div class="clear"></div>';
				c += '</div>';
			} else {
				//填写模式
				SurveyBuild.appInsId == "0" && this._getDefaultVal(data);
				c += '<div class="input-list">';
				c += '	<div class="input-list-info left"><span class="red-star">' + (data.isRequire == "Y" ? "*": "") + '</span>' + data.title + '</div>';
				c += '  <div class="input-list-text left"><input id="' + data.itemId + '" name="' + data.itemId + '" value="' + data.value + '" readonly="readonly" onclick="this.focus()" title="' + data.itemName + '" type="text" class="inpu-list-text-enter"/><img src="' + TzUniversityContextPath + '/statics/images/appeditor/new/calendar.png" class="input-icon" id="' + data.itemId + '_Btn"/></div>';
				c += '  <div class="input-list-suffix left">' + (data.suffixUrl != "" ? '<a target="_blank" href="' + data.suffixUrl + '">': '') + (data["suffix"] ? data.suffix + '<span class="input-list-suffix-span">&nbsp;</span>': "")  + (data.suffixUrl != "" ? '</a>': '') + '<div id="' + data.itemId + 'Tip" class="onShow"><div class="onShow"></div></div></div>';
				c += '  <div class="clear"></div>';
				c += '</div>';
			}
		} else {
			c += '<div class="question-answer">';
			c += '  <div class="format ">';
			c += '      <b class="read-input"></b><span class="suffix">' + (data["suffix"] ? data.suffix: "") + '</span>';
			c += '  </div>';
			c += '</div>';
		}
		return c;
	},
	_edit: function(data) {
		var e = '';
		e = '<div class="edit_item_warp"><span class="edit_item_label">后缀：<a href="#" data-for-id="help_suffix" onclick="SurveyBuild.showMsg(this,event)" class="big-link" data-reveal-id="myModal" data-animation="fade">(?)</a></span>  <input type="text" class="medium" onkeyup="SurveyBuild.saveAttr(this,\'suffix\')" value="' + data.suffix + '"/></div>';
		e += '<div class="edit_item_warp"><span class="edit_item_label">后缀链接：</span>  <input type="text" class="medium" onkeyup="SurveyBuild.saveAttr(this,\'suffixUrl\')" value="' + data.suffixUrl + '"/></div>';
		e += '<div class="edit_item_warp">';
		e += '	<span class="edit_item_label" >日期格式：</span>';
		e += '	<select class="edit_format" onchange="SurveyBuild.saveAttr(this,\'dateformate\')">';
		e += '		<option value="dd-mm-yy" ' + (data.dateformate == "dd-mm-yy" ? "selected='selected'": "") + '>dd-MM-yyyy</option>';
		e += '		<option value="dd/mm/yy" ' + (data.dateformate == "dd/mm/yy" ? "selected='selected'": "") + '>dd/MM/yyyy</option>';
		e += '		<option value="mm-dd-yy" ' + (data.dateformate == "mm-dd-yy" ? "selected='selected'": "") + '>MM-dd-yyyy</option>';
		e += '		<option value="mm/dd/yy" ' + (data.dateformate == "mm/dd/yy" ? "selected='selected'": "") + '>MM/dd/yyyy</option>';
		e += '		<option value="yy-mm-dd" ' + (data.dateformate == "yy-mm-dd" ? "selected='selected'": "") + '>yyyy-MM-dd</option>';
		e += '		<option value="yy/mm/dd" ' + (data.dateformate == "yy/mm/dd" ? "selected='selected'": "") + '>yyyy/MM/dd</option>';
		e += '		<option value="yy/mm" ' + (data.dateformate == "yy/mm" ? "selected='selected'": "") + '>yyyy/MM</option>';
		e += '		<option value="yy-mm" ' + (data.dateformate == "yy-mm" ? "selected='selected'": "") + '>yyyy-MM</option>';
		e += '	</select>';
		e += '</div>';

		e += '<div class="edit_item_warp">';
		e += '	<span class="edit_item_label">年份最小值：</span>';
		e += '	<input type="text" maxlength="4" class="medium minYear" data_id="' + data.instanceId + '" onkeyup="SurveyBuild.saveAttr(this,\'minYear\')" value="' + data.minYear + '"/>';
		e += '</div>';

		e += '<div class="edit_item_warp">';
		e += '	<span class="edit_item_label">年份最大值：</span>';
		e += '	<input type="text" maxlength="4" class="medium maxYear" data_id="' + data.instanceId + '" onkeyup="SurveyBuild.saveAttr(this,\'maxYear\')" value="' + data.maxYear + '"/>';
		e += '</div>';

		e += '<div class="edit_item_warp">';
		e += '  <span class="edit_item_label">默认值：</span>';
		e += '  <input type="text" class="medium" id="defaultval" onkeyup="SurveyBuild.saveAttr(this,\'defaultval\')" value="' + data.defaultval + '"/>';
		e += '</div>';

		e += '<div class="edit_item_warp" style="text-align:right;">';
		e += '  <a href="javascript:void(0);" onclick="SurveyBuild.DynamicBindVal()" class="">动态绑定值</a>';
		e += '</div>';
		
		e += '<div class="edit_item_warp">';
		e += '  <span class="edit_item_label">关联项：</span>';
		e += '  <input type="text" class="medium" id="linkItems" onkeyup="SurveyBuild.saveAttr(this,\'linkItems\')" value="' + data.linkItems + '"/>';
		e += '</div>';

		e += '<div class="edit_jygz">';
		e += '	<span class="title"><i class="icon-cog"></i> 校验规则：</span>';
		e += '  <div class="groupbox">';
		e += '	<div class="edit_item_warp" style="margin-top:5px;">';
		e += '		<input class="mbIE" type="checkbox" onchange="SurveyBuild.saveAttr(this,\'isRequire\')"' + (data.isRequire == "Y" ? "checked='checked'": "") + ' id="is_require"> <label for="is_require">是否必填</label>&nbsp;&nbsp</input>';
		e += '	</div>';
		e += '	</div>';

		e += '	<div class="edit_item_warp">';
		e += '		<a href="javascript:void(0);" onclick="SurveyBuild.RulesSet(this);"><i class="icon-cogs"></i> 高级设置</a>';
		e += '	</div>';
		e += '</div>';
		return e;
	},
	_eventbind: function(data) {
		var $inputBox = $("#" + data.itemId);
		var $selectBtn = $("#" + data.itemId + "_Btn");

		$inputBox.datetimepicker({
			changeMonth: true,
			changeYear: true,
			showTimepicker: false,
			yearRange: data.minYear + ":" + data.maxYear,
			maxDate: new Date(data.maxYear + "-12-31"),
			dateFormat: data.dateformate,
			onSelect: function(dateText, inst) {
				$inputBox.datetimepicker("hide");
				$inputBox.trigger("blur");
			}
		});

		$selectBtn.click(function(e) {
			$inputBox.click();
		});
		$inputBox.formValidator({tipID: data["itemId"] + 'Tip',onShow: "",onFocus: "&nbsp;",onCorrect: "&nbsp;"});
		$inputBox.functionValidator({
			fun: function(val, elem) {
				//执行高级设置中的自定义规则
				/*********************************************\
                 ** 注意：自定义规则中不要使用formValidator **
                 \*********************************************/
				var _result = true;
				if (ValidationRules) {
					$.each(data["rules"],
					function(classname, classObj) {
						if ($.inArray(classname, SurveyBuild._baseRules) == -1 && data["rules"][classname]["isEnable"] == "Y") {
							var _ruleClass = ValidationRules[classname];
							if (_ruleClass && _ruleClass._Validator) {
								_result = _ruleClass._Validator(data["itemId"], classObj["messages"]);
								if (_result !== true) {
									return false;
								}
							}
						}
					});
					if (_result !== true) {
						return _result;
					}
				}
			}
		});
		
		/*关联项*/
		if(data.linkItems){
			var $linkitems = $("#" + data.linkItems);
			if($linkitems && $linkitems.length > 0){
				$inputBox.change(function(e) {
					$linkitems.val($inputBox.val());
					$linkitems.trigger("change");
					$linkitems.trigger("blur");
				});
			}
		}
	},
	_validatorAttr: function(data) {
		var msg;
		var $edit_box = $("#question-edit");
		var maxYear = data.maxYear;
		var minYear = data.minYear;

		if (!maxYear) {
			msg = "年份最大值不能为空！";
			var $targetObj = $edit_box.find(".maxYear");
			SurveyBuild.fail($targetObj, msg);
			return false;
		}
		if (!minYear) {
			msg = "年份最小值不能为空！";
			var $targetObj = $edit_box.find(".minYear");
			SurveyBuild.fail($targetObj, msg);
			return false;
		}
		if (parseInt(maxYear) < parseInt(minYear)) {
			msg = "年份最大值要大于年份最小值！";
			var $targetObj = $edit_box.find(".maxYear");
			SurveyBuild.fail($targetObj, msg);
			return false;
		}
		return true;
	}
});