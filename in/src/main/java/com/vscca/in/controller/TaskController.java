package com.vscca.in.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.dto.TaskDto;
import com.vscca.in.model.BillingClient;
import com.vscca.in.model.TaskInfo;
import com.vscca.in.model.TaskStatus;
import com.vscca.in.model.TaskType;
import com.vscca.in.model.TaskUserDetails;
import com.vscca.in.serivce.BillingClientService;
import com.vscca.in.serivce.TaskInfoService;
import com.vscca.in.serivce.TaskStatusService;
import com.vscca.in.serivce.TaskTypeService;
import com.vscca.in.serivce.TaskUserDetailsService;

@RestController
public class TaskController {
	
	@Autowired
	TaskTypeService taskTypeService;
	
	@Autowired
	BillingClientService billingClientService;
	
	@Autowired
	TaskInfoService taskInfoService;
	
	@Autowired
	TaskStatusService taskStatusService;
	
	@Autowired
	TaskUserDetailsService taskUserDetailsService;
	
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
	
	
	@PostMapping("/createTask")
	public ResponseDto postCreateTask(@RequestBody TaskDto taskDto) {
		ResponseDto response = new ResponseDto();
		TaskInfo taskInfo = new TaskInfo();
		TaskInfo taskId= new TaskInfo();
		TaskUserDetails taskUserDetails= new TaskUserDetails();
		TaskStatus taskStatus = new TaskStatus();
		taskInfo.setProjectName(taskDto.getProjectName());
		taskInfo.setPartyName(taskDto.getPartyName());
		taskInfo.setWeightage(taskDto.getWeightage());
		 SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");  
		    Date date = new Date();  
		taskInfo.setCreatedAt(date);
		 taskInfo.setDueDate(taskDto.getDueDate());
		taskInfo.setBillingClient(taskDto.getBillingClient());
		taskInfo.setTaskType(taskDto.getTaskType());
		taskInfo.setTaskDescription(taskDto.getTaskDescription());
		taskId = taskInfoService.save(taskInfo);
		taskUserDetails.setTaskId(taskId.getId());
		taskUserDetails.setResponsibility(taskDto.getResponsibility());
		taskUserDetails.setConsulting(taskDto.getConsulting());
		taskUserDetails.setExceution(taskDto.getExceution());
		taskUserDetails.setIntimation(taskDto.getIntimation());
		taskUserDetailsService.save(taskUserDetails);
		taskStatus.setTaskId(taskId.getId());
		taskStatus.setStatus("Coming");
		taskStatusService.save(taskStatus);
		response.setSuccess(200);
		response.setMessage("success");
		return response;
	}
	

}
