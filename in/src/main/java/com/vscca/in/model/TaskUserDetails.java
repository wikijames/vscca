package com.vscca.in.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="task_user_details")
public class TaskUserDetails {

	@Id
	@GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY)
	private long id;
	
	@Column(name="task_id")
	private long taskId;
	
	@Column(name="responsibility")
	private String responsibility;
	
	@Column(name="intimation")
	private String intimation;
	
	@Column(name="exceution")
	private String exceution;
	
	@Column(name="consulting")
	private String consulting;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getTaskId() {
		return taskId;
	}

	public void setTaskId(long taskId) {
		this.taskId = taskId;
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
