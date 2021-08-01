package com.vscca.in.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.TaskType;

@Repository
public interface TaskTypeRepository extends JpaRepository<TaskType, Long> {
	
	List<TaskType> findAll();

}
