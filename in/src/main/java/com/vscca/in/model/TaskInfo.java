package com.vscca.in.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="task_info")
public class TaskInfo {

	@Id
	@GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY)
	private long Id;
	
	@Column(name="project_name")
	private String projectName;
	
	@Column(name="party_name")
	private String partyName;
	
	@Column(name="weightage")
	private int weightage;
	
	@Column(name="task_description")
	private String taskDescription;
	
	@Column(name="task_type")
	private String taskType;
	
	@Column(name="billing_client")
	private String billingClient;
	
	@Column(name = "created_at")
	private Date createdAt;
	
	@Column(name = "due_date")
	private Date dueDate;

	public long getId() {
		return Id;
	}

	public void setId(long id) {
		Id = id;
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

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}
	
	
	
	
	
	
}
