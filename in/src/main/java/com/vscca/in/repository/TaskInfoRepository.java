package com.vscca.in.repository;

import java.util.List;
import java.util.Objects;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.TaskInfo;

@Repository
public interface TaskInfoRepository extends JpaRepository<TaskInfo, Long> {
	
	@Transactional
	TaskInfo save(TaskInfo taskInfo);
	
	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_info as ti ,vscca.task_status as ts,vscca.task_user_details as tud  where ti.id=ts.task_id and ti.id=tud.task_id and tud.responsibility= ? ",nativeQuery=true)
	List<Object[]> findTaskDetails(String emailId);

	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_info as ti ,vscca.task_status as ts,vscca.task_user_details as tud  where ti.id=ts.task_id and ti.id=tud.task_id and tud.intimation= ? ",nativeQuery=true)
	List<Object[]> findTaskDetailsIntimation(String emailId);

}
