package com.vscca.in.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="task_type")
public class TaskType {

	@Id
	@GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY)
	private long Id;
	
	@Column(name="task")
	private String task;

	public long getId() {
		return Id;
	}

	public void setId(long id) {
		Id = id;
	}

	public String getTask() {
		return task;
	}

	public void setTask(String task) {
		this.task = task;
	}
	
	
	
	
	
}
