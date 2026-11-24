package com.vscca.in.dto;

import javax.persistence.Column;

public class DscDto {

	private long Id;
	private String personName;
	private String active;
	private String createdAt;
	private String purpose;
	private int validity;
	private String validTill;
	private String category;
	private String mobileNo;
	private String feesCollected;
	private String dscWithUs;
	private String dscWithPerson;
	private String remark;
	
	public long getId() {
		return Id;
	}
	public void setId(long id) {
		Id = id;
	}
	public String getPersonName() {
		return personName;
	}
	public void setPersonName(String personName) {
		this.personName = personName;
	}
	public String getActive() {
		return active;
	}
	public void setActive(String active) {
		this.active = active;
	}
	public String getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}
	public String getPurpose() {
		return purpose;
	}
	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}
	public int getValidity() {
		return validity;
	}
	public void setValidity(int validity) {
		this.validity = validity;
	}
	public String getValidTill() {
		return validTill;
	}
	public void setValidTill(String validTill) {
		this.validTill = validTill;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getMobileNo() {
		return mobileNo;
	}
	public void setMobileNo(String mobileNo) {
		this.mobileNo = mobileNo;
	}
	public String getFeesCollected() {
		return feesCollected;
	}
	public void setFeesCollected(String feesCollected) {
		this.feesCollected = feesCollected;
	}
	public String getDscWithUs() {
		return dscWithUs;
	}
	public void setDscWithUs(String dscWithUs) {
		this.dscWithUs = dscWithUs;
	}
	public String getDscWithPerson() {
		return dscWithPerson;
	}
	public void setDscWithPerson(String dscWithPerson) {
		this.dscWithPerson = dscWithPerson;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
}
