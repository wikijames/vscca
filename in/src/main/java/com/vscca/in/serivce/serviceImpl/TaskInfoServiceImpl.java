package com.vscca.in.serivce.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.TaskInfo;
import com.vscca.in.repository.TaskInfoRepository;
import com.vscca.in.serivce.TaskInfoService;

@Service
public class TaskInfoServiceImpl implements TaskInfoService {

	@Autowired
	TaskInfoRepository taskInfoRepository;

	@Override
	public TaskInfo save(TaskInfo taskInfo) {
		// TODO Auto-generated method stub
		return taskInfoRepository.save(taskInfo);
	}

}
