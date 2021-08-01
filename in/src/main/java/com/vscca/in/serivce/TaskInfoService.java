package com.vscca.in.serivce;

import java.util.List;


import com.vscca.in.model.TaskInfo;

public interface TaskInfoService {

	TaskInfo save(TaskInfo taskInfo);
	
	List<Object[]> findTaskDetails(String emailId);
}
