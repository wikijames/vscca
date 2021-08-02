package com.vscca.in.serivce;

import java.util.List;


import com.vscca.in.model.TaskInfo;

public interface TaskInfoService {

	TaskInfo save(TaskInfo taskInfo);
	
	List<Object[]> findTaskDetails(String emailId);
	
	List<Object[]> findTaskDetailsIntimation(String emailId);
	
	List<Object[]> findTaskDetailsExceution(String emailId);
	
	List<Object[]> findTaskDetailsConsulting(String emailId);
	
	List<Object[]> findTaskDetailsById(String taskId);
}
