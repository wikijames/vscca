package com.vscca.in.dto;

import java.util.Date;

import javax.persistence.Column;

public class TaskDto {
	
	private String projectName;
	private String partyName;
	private int weightage;
	private String taskDescription;
	private String taskType;
	private String billingClient;
	private Date createdAt;
	private Date dueDate;
	private String responsibility;
	private String intimation;
	private String exceution;
	private String consulting;
	
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
	public Date getDueDate() {
		return dueDate;
	}
	public void setDueDate(Date dueDate) {
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
	
	
	
	

}
