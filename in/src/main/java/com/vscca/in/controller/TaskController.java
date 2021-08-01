package com.vscca.in.controller;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
		List<BillingClient> clients = billingClientService.findAll();
		response.setSuccess(200);
		response.setBody(clients);
		response.setMessage("success");
		return response;
	}

	@PostMapping("/createTask")
	public ResponseDto postCreateTask(@RequestBody TaskDto taskDto) {
		ResponseDto response = new ResponseDto();
		TaskInfo taskInfo = new TaskInfo();
		TaskInfo taskId = new TaskInfo();
		TaskUserDetails taskUserDetails = new TaskUserDetails();
		TaskStatus taskStatus = new TaskStatus();
		taskInfo.setProjectName(taskDto.getProjectName());
		taskInfo.setPartyName(taskDto.getPartyName());
		taskInfo.setWeightage(taskDto.getWeightage());
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Date date = new Date();
		taskInfo.setCreatedAt(date);
		taskInfo.setDueDate(new Date(new SimpleDateFormat("dd/MM/yyyy").format(taskDto.getDueDate())));
		taskInfo.setBillingClient(taskDto.getBillingClient());
		taskInfo.setTaskType(taskDto.getTaskType());
		taskInfo.setTaskDescription(taskDto.getTaskDescription());
		taskId = taskInfoService.save(taskInfo);
		taskUserDetails.setTaskId(taskId.getId());
		taskUserDetails.setResponsibility(taskDto.getResponsibility());
		taskUserDetails.setConsulting(taskDto.getConsulting());
		taskUserDetails.setExceution(taskDto.getExceution());
		taskUserDetails.setIntimation(taskDto.getIntimation());
		taskStatus.setTaskId(taskId.getId());
		taskStatus.setStatus("Coming");
		taskUserDetailsService.save(taskUserDetails);
		taskStatusService.save(taskStatus);
		response.setSuccess(200);
		response.setMessage("success");
		return response;
	}
	
	@GetMapping("/taskDetails")
	public ResponseDto getTaskDetails(@RequestParam String emailId) {
		ResponseDto response = new ResponseDto();
		List<Object[]> taskDetails = taskInfoService.findTaskDetails(emailId);
		List<TaskDto> task= new ArrayList<TaskDto>();
		for (Object[] result : taskDetails) {
			TaskDto taskDto= new TaskDto(); 
			if(result[0]!= null) {
			taskDto.setTaskId(((BigInteger) result[0]).longValue());
			}
			if(result[1]!= null) {
			taskDto.setProjectName(result[1].toString());
			}
			if(result[2]!= null) {
			taskDto.setPartyName(result[2].toString());
			}
			if(result[3]!= null) {
			taskDto.setWeightage((Integer)result[3]);
			}
			if(result[4]!= null) {
			taskDto.setTaskDescription(result[4].toString());
			}
			if(result[5]!= null) {
			taskDto.setTaskType(result[5].toString());
			}
			if(result[6]!= null) {
			taskDto.setBillingClient(result[6].toString());
			}
			if(result[7]!= null) {
			taskDto.setCreatedAt((Date)result[7]);
			}
			if(result[8]!= null) {
			taskDto.setDueDate((Date)result[8]);
			}
			if(result[9]!= null) {
			taskDto.setStatus(result[9].toString());
			}
			if(result[10]!= null) {
			taskDto.setDelayReason(result[10].toString());
			}
			if(result[11]!= null) {
			taskDto.setRemarks(result[11].toString());
			}
			if(result[12]!= null) {
			taskDto.setEndDate((Date)result[12]);
			}
			if(result[13]!= null) {
			taskDto.setResponsibility(result[13].toString());
			}
			if(result[14]!= null) {
			taskDto.setIntimation(result[14].toString());
			}
			if(result[15]!= null) {
			taskDto.setExceution(result[15].toString());
			}
			if(result[16]!= null) {
			taskDto.setConsulting(result[16].toString());
			}
			task.add(taskDto);
		}
		
		
		response.setSuccess(200);
		response.setBody(task);
		response.setMessage("success");
		return response;
	}

	
	@GetMapping("/taskDetailsIntimation")
	public ResponseDto getTaskDetailsIntimation(@RequestParam String emailId) {
		ResponseDto response = new ResponseDto();
		List<Object[]> taskDetails = taskInfoService.findTaskDetailsIntimation(emailId);
		List<TaskDto> task= new ArrayList<TaskDto>();
		for (Object[] result : taskDetails) {
			TaskDto taskDto= new TaskDto(); 
			if(result[0]!= null) {
			taskDto.setTaskId(((BigInteger) result[0]).longValue());
			}
			if(result[1]!= null) {
			taskDto.setProjectName(result[1].toString());
			}
			if(result[2]!= null) {
			taskDto.setPartyName(result[2].toString());
			}
			if(result[3]!= null) {
			taskDto.setWeightage((Integer)result[3]);
			}
			if(result[4]!= null) {
			taskDto.setTaskDescription(result[4].toString());
			}
			if(result[5]!= null) {
			taskDto.setTaskType(result[5].toString());
			}
			if(result[6]!= null) {
			taskDto.setBillingClient(result[6].toString());
			}
			if(result[7]!= null) {
			taskDto.setCreatedAt((Date)result[7]);
			}
			if(result[8]!= null) {
			taskDto.setDueDate((Date)result[8]);
			}
			if(result[9]!= null) {
			taskDto.setStatus(result[9].toString());
			}
			if(result[10]!= null) {
			taskDto.setDelayReason(result[10].toString());
			}
			if(result[11]!= null) {
			taskDto.setRemarks(result[11].toString());
			}
			if(result[12]!= null) {
			taskDto.setEndDate((Date)result[12]);
			}
			if(result[13]!= null) {
			taskDto.setResponsibility(result[13].toString());
			}
			if(result[14]!= null) {
			taskDto.setIntimation(result[14].toString());
			}
			if(result[15]!= null) {
			taskDto.setExceution(result[15].toString());
			}
			if(result[16]!= null) {
			taskDto.setConsulting(result[16].toString());
			}
			task.add(taskDto);
		}
		
		
		response.setSuccess(200);
		response.setBody(task);
		response.setMessage("success");
		return response;
	}

	@GetMapping("/taskDetailsExceution")
	public ResponseDto getTaskDetailsExceution(@RequestParam String emailId) {
		ResponseDto response = new ResponseDto();
		List<Object[]> taskDetails = taskInfoService.findTaskDetailsExceution(emailId);
		List<TaskDto> task= new ArrayList<TaskDto>();
		for (Object[] result : taskDetails) {
			TaskDto taskDto= new TaskDto(); 
			if(result[0]!= null) {
			taskDto.setTaskId(((BigInteger) result[0]).longValue());
			}
			if(result[1]!= null) {
			taskDto.setProjectName(result[1].toString());
			}
			if(result[2]!= null) {
			taskDto.setPartyName(result[2].toString());
			}
			if(result[3]!= null) {
			taskDto.setWeightage((Integer)result[3]);
			}
			if(result[4]!= null) {
			taskDto.setTaskDescription(result[4].toString());
			}
			if(result[5]!= null) {
			taskDto.setTaskType(result[5].toString());
			}
			if(result[6]!= null) {
			taskDto.setBillingClient(result[6].toString());
			}
			if(result[7]!= null) {
			taskDto.setCreatedAt((Date)result[7]);
			}
			if(result[8]!= null) {
			taskDto.setDueDate((Date)result[8]);
			}
			if(result[9]!= null) {
			taskDto.setStatus(result[9].toString());
			}
			if(result[10]!= null) {
			taskDto.setDelayReason(result[10].toString());
			}
			if(result[11]!= null) {
			taskDto.setRemarks(result[11].toString());
			}
			if(result[12]!= null) {
			taskDto.setEndDate((Date)result[12]);
			}
			if(result[13]!= null) {
			taskDto.setResponsibility(result[13].toString());
			}
			if(result[14]!= null) {
			taskDto.setIntimation(result[14].toString());
			}
			if(result[15]!= null) {
			taskDto.setExceution(result[15].toString());
			}
			if(result[16]!= null) {
			taskDto.setConsulting(result[16].toString());
			}
			task.add(taskDto);
		}
		
		
		response.setSuccess(200);
		response.setBody(task);
		response.setMessage("success");
		return response;
	}
	
	
	@GetMapping("/taskDetailsConsulting")
	public ResponseDto getTaskDetailsConsulting(@RequestParam String emailId) {
		ResponseDto response = new ResponseDto();
		List<Object[]> taskDetails = taskInfoService.findTaskDetailsConsulting(emailId);
		List<TaskDto> task= new ArrayList<TaskDto>();
		for (Object[] result : taskDetails) {
			TaskDto taskDto= new TaskDto(); 
			if(result[0]!= null) {
			taskDto.setTaskId(((BigInteger) result[0]).longValue());
			}
			if(result[1]!= null) {
			taskDto.setProjectName(result[1].toString());
			}
			if(result[2]!= null) {
			taskDto.setPartyName(result[2].toString());
			}
			if(result[3]!= null) {
			taskDto.setWeightage((Integer)result[3]);
			}
			if(result[4]!= null) {
			taskDto.setTaskDescription(result[4].toString());
			}
			if(result[5]!= null) {
			taskDto.setTaskType(result[5].toString());
			}
			if(result[6]!= null) {
			taskDto.setBillingClient(result[6].toString());
			}
			if(result[7]!= null) {
			taskDto.setCreatedAt((Date)result[7]);
			}
			if(result[8]!= null) {
			taskDto.setDueDate((Date)result[8]);
			}
			if(result[9]!= null) {
			taskDto.setStatus(result[9].toString());
			}
			if(result[10]!= null) {
			taskDto.setDelayReason(result[10].toString());
			}
			if(result[11]!= null) {
			taskDto.setRemarks(result[11].toString());
			}
			if(result[12]!= null) {
			taskDto.setEndDate((Date)result[12]);
			}
			if(result[13]!= null) {
			taskDto.setResponsibility(result[13].toString());
			}
			if(result[14]!= null) {
			taskDto.setIntimation(result[14].toString());
			}
			if(result[15]!= null) {
			taskDto.setExceution(result[15].toString());
			}
			if(result[16]!= null) {
			taskDto.setConsulting(result[16].toString());
			}
			task.add(taskDto);
		}
		
		
		response.setSuccess(200);
		response.setBody(task);
		response.setMessage("success");
		return response;
	}
}
