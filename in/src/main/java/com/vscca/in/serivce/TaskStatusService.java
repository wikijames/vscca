package com.vscca.in.serivce;

import com.vscca.in.model.TaskStatus;

public interface TaskStatusService {

	TaskStatus save(TaskStatus taskStatus);
	
	void deleteByTaskId(Long taskId);
}
