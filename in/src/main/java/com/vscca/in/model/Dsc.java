package com.vscca.in.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "dsc")
public class Dsc {
	
	
	@Id
	@GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY)
	private long Id;

	@Column(name="person_name", length=50)
	private String personName;
	
	@Column(name="active" )
	private String active;
	
	@Column(name="created_at" )
	private String createdAt;
	
	@Column(name="purpose" )
	private String purpose;
	
	@Column(name="validity" )
	private int validity;
	
	@Column(name="valid_till" )
	private String validTill;
	
	@Column(name="category" )
	private String category;
	
	@Column(name="mobile_no" )
	private String mobileNo;
	
	@Column(name="fees_collected" )
	private String feesCollected;
	
	@Column(name="Dsc_with_us" )
	private String dscWithUs;
	
	@Column(name="Dsc_with_person" )
	private String dscWithPerson;
	
	@Column(name="remark" )
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
