package com.tranzvision.gd.TZBatchProcessBundle.model;

public class TzProcessServerKey {
    private String tzJgId;

    private String tzJcfwqMc;

    public String getTzJgId() {
        return tzJgId;
    }

    public void setTzJgId(String tzJgId) {
        this.tzJgId = tzJgId == null ? null : tzJgId.trim();
    }

    public String getTzJcfwqMc() {
        return tzJcfwqMc;
    }

    public void setTzJcfwqMc(String tzJcfwqMc) {
        this.tzJcfwqMc = tzJcfwqMc == null ? null : tzJcfwqMc.trim();
    }
}