/**
 * 自动标签
 * 标签清华（北大）生源：本科教育经历是清华或北大，且有学士学位(且分类为普通本科)
 * TZ_APP_FORM_STA：S 保存；  U 提交；  P 预提交
 * TZ_FORM_SP_STA：A 审批通过； B 拒绝； N 待审核
 * guXd 2017年6月28日16:20:57 update：分类为普通本科
 */

SELECT X.TZ_APP_INS_ID
FROM PS_TZ_FORM_WRK_T Y,
     PS_TZ_APP_INS_T X
WHERE Y.TZ_APP_INS_ID=X.TZ_APP_INS_ID
  AND X.TZ_APP_FORM_STA='U'
  AND Y.TZ_FORM_SP_STA<>'B'
  AND Y.TZ_BATCH_ID=?
  AND Y.TZ_CLASS_ID=?
  and (
  (EXISTS (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_11luniversitysch'
AND TZ_APP_S_TEXT IN ('清华大学','北京大学')) AND exists (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_11xl'
AND TZ_APP_S_TEXT ='3') AND exists (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_11TZ_TZ_11_4'
AND TZ_APP_S_TEXT ='1') AND exists (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_11fl'
AND TZ_APP_S_TEXT ='1')) OR (
EXISTS (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_12ouniversitysch'
AND TZ_APP_S_TEXT IN ('清华大学','北京大学')) AND exists (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_12xl2'
AND TZ_APP_S_TEXT ='1') AND exists (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_12xw2'
AND TZ_APP_S_TEXT ='1') AND exists (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_12fl2'
AND TZ_APP_S_TEXT ='1'))
OR (
EXISTS (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_13ouniver3sch'
AND TZ_APP_S_TEXT IN ('清华大学','北京大学')) AND exists (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_13xueli3'
AND TZ_APP_S_TEXT ='1') AND exists (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_13xuewei3'
AND TZ_APP_S_TEXT ='1') AND exists (SELECT 'Y' FROM PS_TZ_APP_CC_T WHERE TZ_APP_INS_ID=X.TZ_APP_INS_ID AND TZ_XXX_BH='TZ_13TZ_TZ_13_6'
AND TZ_APP_S_TEXT ='1'))
  )