package com.vscca.in.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.TaskInfo;

@Repository
public interface TaskInfoRepository extends JpaRepository<TaskInfo, Long> {
	
	@Transactional
	TaskInfo save(TaskInfo taskInfo);

}
