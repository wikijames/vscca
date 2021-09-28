package com.vscca.in.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.TaskInfo;
import com.vscca.in.model.TaskUserDetails;

@Repository
public interface TaskUserDetailsRepository extends JpaRepository<TaskUserDetails, Long> {

	@Transactional
	TaskUserDetails save(TaskUserDetails taskUserDetails);
	
	@Query(value="select * from vscca.task_user_details where task_id=?",nativeQuery=true)
	TaskUserDetails getById(Long taskId);
	void deleteByTaskId(Long taskId);
}
