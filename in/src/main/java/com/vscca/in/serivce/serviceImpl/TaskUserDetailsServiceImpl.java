package com.vscca.in.serivce.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.TaskUserDetails;
import com.vscca.in.repository.TaskUserDetailsRepository;
import com.vscca.in.serivce.TaskUserDetailsService;

@Service
public class TaskUserDetailsServiceImpl implements TaskUserDetailsService {

	@Autowired
	TaskUserDetailsRepository taskUserDetailsRepository;
	
	@Override
	public TaskUserDetails save(TaskUserDetails taskUserDetails) {
		// TODO Auto-generated method stub
		return taskUserDetailsRepository.save(taskUserDetails);
	}

	@Override
	public TaskUserDetails getById(Long taskId) {
		// TODO Auto-generated method stub
		return taskUserDetailsRepository.getById(taskId);
	}

	@Override
	public void deleteByTaskId(Long taskId) {
		// TODO Auto-generated method stub
		taskUserDetailsRepository.deleteByTaskId(taskId);
	}

}
