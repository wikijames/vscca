package com.vscca.in.serivce.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.TaskStatus;
import com.vscca.in.repository.TaskStatusRepository;
import com.vscca.in.serivce.TaskStatusService;

@Service
public class TaskStatusServiceImpl implements TaskStatusService{
	
	@Autowired
	TaskStatusRepository taskStatusRepository;

	@Override
	public TaskStatus save(TaskStatus taskStatus) {
	
		return taskStatusRepository.save(taskStatus);
	}

}
