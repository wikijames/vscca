package com.vscca.in.serivce;

import java.util.List;


import com.vscca.in.model.TaskInfo;

public interface TaskInfoService {

	TaskInfo save(TaskInfo taskInfo);
	
	List<Object[]> findTaskDetails();
	
	List<Object[]> findTaskDetailsIntimation(String emailId);
	
	List<Object[]> findTaskDetailsExceution(String emailId);
	
	List<Object[]> findTaskDetailsConsulting(String emailId);
	
	List<Object[]> findTaskDetailsById(String taskId);
	
	//List<Object[]> findTaskDetailsUser(String emailId,String emailId,);
	
	List<Object[]> findTaskDetailsByUser(String emailId);
	
	List<Object[]> findTaskDetailsForUsersToday(String emailId);
	
	
	List<Object[]> findTaskDetailsForUsersWeek(String emailId);
	
	List<Object[]> findTaskDetailsForUsersByDueDate(String emailId);
	
	TaskInfo getById(Long id);
}
