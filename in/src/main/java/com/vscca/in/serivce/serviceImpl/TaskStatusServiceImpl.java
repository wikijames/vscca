package com.vscca.in.serivce.serviceImpl;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

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

	@Override
	public void deleteByTaskId(Long taskId) {
		// TODO Auto-generated method stub
		taskStatusRepository.deleteByTaskId(taskId);
	}

	@Override
	@Transactional
	public void bulkUpdateStatus(List<Long> taskIds, String status, String remarks, String delayReason) {
		Date now = new Date();
		if (taskIds == null) {
			return;
		}
		for (Long taskId : taskIds) {
			if (taskId == null) {
				continue;
			}
			TaskStatus taskStatus = new TaskStatus();
			taskStatus.setTaskId(taskId);
			taskStatus.setStatus(status);
			taskStatus.setEndDate(now);
			if (remarks != null && !"".equals(remarks.trim())) {
				taskStatus.setRemarks(remarks);
			}
			if (delayReason != null && !"".equals(delayReason.trim())) {
				taskStatus.setDelayReason(delayReason);
			}
			taskStatusRepository.save(taskStatus);
		}
	}

}
