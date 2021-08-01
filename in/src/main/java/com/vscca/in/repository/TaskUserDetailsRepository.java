package com.vscca.in.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.TaskUserDetails;

@Repository
public interface TaskUserDetailsRepository extends JpaRepository<TaskUserDetails, Long> {

	@Transactional
	TaskUserDetails save(TaskUserDetails taskUserDetails);
}
