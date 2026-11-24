package com.vscca.in.dto;

import java.util.Date;

import javax.persistence.Column;

public class TaskDto {
	
	private Long taskId;
	private String projectName;
	private String partyName;
	private int weightage;
	private String taskDescription;
	private String taskType;
	private String billingClient;
	private Date createdAt;
	private String dueDate;
	private String responsibility;
	private String intimation;
	private String exceution;
	private String consulting;
	private String status;
	private String delayReason;
	private String remarks;
	private Date endDate;
	private String responsibilityName;
	private String exceutionName;
	private String intimationName;
	private String consultingName;
	private String finalWeightage;
	
	

	public Long getTaskId() {
		return taskId;
	}
	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getPartyName() {
		return partyName;
	}
	public void setPartyName(String partyName) {
		this.partyName = partyName;
	}
	public int getWeightage() {
		return weightage;
	}
	public void setWeightage(int weightage) {
		this.weightage = weightage;
	}
	public String getTaskDescription() {
		return taskDescription;
	}
	public void setTaskDescription(String taskDescription) {
		this.taskDescription = taskDescription;
	}
	public String getTaskType() {
		return taskType;
	}
	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}
	public String getBillingClient() {
		return billingClient;
	}
	public void setBillingClient(String billingClient) {
		this.billingClient = billingClient;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	
	public String getDueDate() {
		return dueDate;
	}
	public void setDueDate(String dueDate) {
		this.dueDate = dueDate;
	}
	public String getResponsibility() {
		return responsibility;
	}
	public void setResponsibility(String responsibility) {
		this.responsibility = responsibility;
	}
	public String getIntimation() {
		return intimation;
	}
	public void setIntimation(String intimation) {
		this.intimation = intimation;
	}
	public String getExceution() {
		return exceution;
	}
	public void setExceution(String exceution) {
		this.exceution = exceution;
	}
	public String getConsulting() {
		return consulting;
	}
	public void setConsulting(String consulting) {
		this.consulting = consulting;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getDelayReason() {
		return delayReason;
	}
	public void setDelayReason(String delayReason) {
		this.delayReason = delayReason;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getResponsibilityName() {
		return responsibilityName;
	}
	public void setResponsibilityName(String responsibilityName) {
		this.responsibilityName = responsibilityName;
	}
	public String getExceutionName() {
		return exceutionName;
	}
	public void setExceutionName(String exceutionName) {
		this.exceutionName = exceutionName;
	}
	public String getIntimationName() {
		return intimationName;
	}
	public void setIntimationName(String intimationName) {
		this.intimationName = intimationName;
	}
	public String getConsultingName() {
		return consultingName;
	}
	public void setConsultingName(String consultingName) {
		this.consultingName = consultingName;
	}
	public String getFinalWeightage() {
		return finalWeightage;
	}
	public void setFinalWeightage(String finalWeightage) {
		this.finalWeightage = finalWeightage;
	}
	
	
	
	
	
	

}
