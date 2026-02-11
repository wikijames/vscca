package com.vscca.in.serivce;

import java.util.List;

import com.vscca.in.model.TaskStatus;

public interface TaskStatusService {

	TaskStatus save(TaskStatus taskStatus);
	
	void deleteByTaskId(Long taskId);
	
	void bulkUpdateStatus(List<Long> taskIds, String status, String remarks, String delayReason);
}
