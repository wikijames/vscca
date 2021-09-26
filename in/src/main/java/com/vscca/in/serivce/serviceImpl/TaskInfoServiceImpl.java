package com.vscca.in.serivce.serviceImpl;

import java.util.List;


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

	@Override
	public List<Object[]> findTaskDetails() {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetails();
	}

	@Override
	public List<Object[]> findTaskDetailsIntimation(String emailId) {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetailsIntimation(emailId);
	}

	@Override
	public List<Object[]> findTaskDetailsExceution(String emailId) {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetailsExceution(emailId);
	}

	@Override
	public List<Object[]> findTaskDetailsConsulting(String emailId) {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetailsConsulting(emailId);
	}

	@Override
	public List<Object[]> findTaskDetailsById(String taskId) {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetailsById(taskId);
	}

	@Override
	public List<Object[]> findTaskDetailsByUser(String emailId) {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetailsByUser(emailId);
	}

	@Override
	public List<Object[]> findTaskDetailsForUsersToday(String emailId) {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetailsForUsersToday(emailId);
	}

	@Override
	public List<Object[]> findTaskDetailsForUsersWeek(String emailId) {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetailsForUsersWeek(emailId);
	}

	@Override
	public List<Object[]> findTaskDetailsForUsersByDueDate(String emailId) {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetailsForUsersByDueDate(emailId);
	}

	@Override
	public TaskInfo getById(Long id) {
		// TODO Auto-generated method stub
		return taskInfoRepository.getById(id);
	}

	@Override
	public List<Object[]> findTaskDetailsDayBook(String startDate, String endDate) {
		// TODO Auto-generated method stub
		return taskInfoRepository.findTaskDetailsDayBook(startDate, endDate);
	}

}
