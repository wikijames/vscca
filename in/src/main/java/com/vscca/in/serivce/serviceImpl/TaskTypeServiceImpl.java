package com.vscca.in.serivce.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.TaskType;
import com.vscca.in.repository.TaskTypeRepository;
import com.vscca.in.serivce.TaskTypeService;

@Service
public class TaskTypeServiceImpl implements TaskTypeService{

	@Autowired
	TaskTypeRepository taskTypeRepository;
	
	@Override
	public List<TaskType> findAll() {
		// TODO Auto-generated method stub
		return taskTypeRepository.findAll();
	}

}
