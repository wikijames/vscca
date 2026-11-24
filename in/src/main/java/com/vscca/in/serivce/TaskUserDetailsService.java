package com.vscca.in.serivce;

import com.vscca.in.model.TaskUserDetails;

public interface TaskUserDetailsService {

	TaskUserDetails save(TaskUserDetails taskUserDetails);
	
	TaskUserDetails getById(Long taskId);
	
	void deleteByTaskId(Long taskId);
}
