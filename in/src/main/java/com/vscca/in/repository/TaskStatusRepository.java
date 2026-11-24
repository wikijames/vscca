package com.vscca.in.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.TaskStatus;

@Repository
public interface TaskStatusRepository extends JpaRepository<TaskStatus, Long>{
	
	@Transactional
	TaskStatus save(TaskStatus taskStatus);
	
	@Transactional
	void deleteByTaskId(Long taskId);
}
