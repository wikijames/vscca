package com.vscca.in.serivce;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vscca.in.model.TaskType;

@Service
public interface TaskTypeService {
	
	List<TaskType> findAll();

}
