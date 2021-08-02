package com.vscca.in.controller;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.dto.TaskDto;
import com.vscca.in.model.BillingClient;
import com.vscca.in.model.LoginTable;
import com.vscca.in.model.TaskInfo;
import com.vscca.in.model.TaskStatus;
import com.vscca.in.model.TaskType;
import com.vscca.in.model.TaskUserDetails;
import com.vscca.in.serivce.BillingClientService;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.serivce.TaskInfoService;
import com.vscca.in.serivce.TaskStatusService;
import com.vscca.in.serivce.TaskTypeService;
import com.vscca.in.serivce.TaskUserDetailsService;
import com.vscca.in.utill.TokenValidation;
import com.vscca.in.utill.VsccaConstants;

import io.jsonwebtoken.Jwts;

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
	
	@Autowired
	LoginService loginService;

	@GetMapping("/tasks")
	public ResponseDto getTaskType(HttpServletRequest req) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
		List<TaskType> tasks = taskTypeService.findAll();
		response.setSuccess(200);
		response.setBody(tasks);
		response.setMessage("success");
			}
		return response;
	}

	@GetMapping("/billingClients")
	public ResponseDto getBillingClients(HttpServletRequest req) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
		List<BillingClient> clients = billingClientService.findAll();
		response.setSuccess(200);
		response.setBody(clients);
		response.setMessage("success");
			}
		return response;
	}

	@PostMapping("/createTask")
	public ResponseDto postCreateTask(HttpServletRequestWrapper req,@RequestBody TaskDto taskDto) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);

		TaskInfo taskInfo = new TaskInfo();
		TaskInfo taskId = new TaskInfo();
		TaskUserDetails taskUserDetails = new TaskUserDetails();
		TaskStatus taskStatus = new TaskStatus();
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {

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
		}
		return response;
	}
	
	@GetMapping("/taskDetails")
	public ResponseDto getTaskDetails(HttpServletRequestWrapper req) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
				String emailId=TokenValidation.finadEmailIdByToken(token);
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
			taskDto.setDueDate(result[8].toString());
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
			}
		return response;
	}

	
	@GetMapping("/taskDetailsIntimation")
	public ResponseDto getTaskDetailsIntimation(HttpServletRequest req) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
				String emailId=TokenValidation.finadEmailIdByToken(token);
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
				taskDto.setDueDate(result[8].toString());
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
			}
		return response;
	}

	@GetMapping("/taskDetailsExceution")
	public ResponseDto getTaskDetailsExceution(HttpServletRequest req) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
				String emailId=TokenValidation.finadEmailIdByToken(token);
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
				taskDto.setDueDate(result[8].toString());
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
			}
		return response;
	}
	
	
	@GetMapping("/taskDetailsConsulting")
	public ResponseDto getTaskDetailsConsulting(HttpServletRequest req) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
				String emailId=TokenValidation.finadEmailIdByToken(token);
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
				taskDto.setDueDate(result[8].toString());
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
			}
		return response;
	}
	
	@GetMapping("/taskDetailsById")
	public ResponseDto getTaskDetailsConsulting(HttpServletRequest req,@RequestParam String taskId) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
		List<Object[]> taskDetails = taskInfoService.findTaskDetailsById(taskId);
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
				taskDto.setDueDate(result[8].toString());
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
			}
		return response;
	}
	
	
	@PostMapping("/editTask")
	public ResponseDto editTask(HttpServletRequestWrapper req,@RequestBody TaskDto taskDto) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		TaskStatus taskStatus = new TaskStatus();
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {

//		taskInfo.setProjectName(taskDto.getProjectName());
//		taskInfo.setPartyName(taskDto.getPartyName());
//		taskInfo.setWeightage(taskDto.getWeightage());
		SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
		Date date = new Date();
//		taskInfo.setCreatedAt(date);
//		taskInfo.setDueDate(new Date(new SimpleDateFormat("dd/MM/yyyy").format(taskDto.getDueDate())));
//		taskInfo.setBillingClient(taskDto.getBillingClient());
//		taskInfo.setTaskType(taskDto.getTaskType());
//		taskInfo.setTaskDescription(taskDto.getTaskDescription());
//		taskId = taskInfoService.save(taskInfo);
//		taskUserDetails.setTaskId(taskId.getId());
//		taskUserDetails.setResponsibility(taskDto.getResponsibility());
//		taskUserDetails.setConsulting(taskDto.getConsulting());
//		taskUserDetails.setExceution(taskDto.getExceution());
//		taskUserDetails.setIntimation(taskDto.getIntimation());
//		taskStatus.setTaskId(taskId.getId());
		taskStatus.setStatus(taskDto.getStatus());
		taskStatus.setTaskId(taskDto.getTaskId());
		taskStatus.setEndDate(date);
		taskStatus.setRemarks(taskDto.getRemarks());
		taskStatus.setDelayReason(taskDto.getDelayReason());
		//taskUserDetailsService.save(taskUserDetails);
		taskStatusService.save(taskStatus);
		response.setSuccess(200);
		response.setMessage("success");
		}
		return response;
	}
	
	
	
	public boolean getTokenAuthentication(String token) {
		if(token != null) {
			
		String emailId= Jwts.parser().setSigningKey(VsccaConstants.secretKey).parseClaimsJws(token).getBody().getSubject();
		LoginTable details= new LoginTable();
		details = loginService.findByuserName(emailId);
		if(null == details.getToken()) {
			return false;
		}
		
		String tokenByEmailId= details.getToken();
		if(tokenByEmailId.equals(token)) {
			return true;
		}else {
			return false;
		}
		}
		return false;
		
	}
}
