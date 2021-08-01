package com.vscca.in.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.BillingClient;
import com.vscca.in.model.TaskType;
import com.vscca.in.serivce.BillingClientService;
import com.vscca.in.serivce.TaskTypeService;

public class TaskController {
	
	@Autowired
	TaskTypeService taskTypeService;
	
	@Autowired
	BillingClientService billingClientService;
	
	@GetMapping("/tasks")
	public ResponseDto getTaskType() {
		ResponseDto response = new ResponseDto();
		List<TaskType> tasks = taskTypeService.findAll();
		response.setSuccess(200);
		response.setBody(tasks);
		response.setMessage("success");
		return response;
	}
	
	@GetMapping("/billingClients")
	public ResponseDto getBillingClients() {
		ResponseDto response = new ResponseDto();
		List<BillingClient> clients= billingClientService.findAll();
		response.setSuccess(200);
		response.setBody(clients);
		response.setMessage("success");
		return response;
	}

}
