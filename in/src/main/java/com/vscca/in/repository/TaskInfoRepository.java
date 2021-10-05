package com.vscca.in.repository;

import java.util.List;
import java.util.Objects;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.BillingClient;
import com.vscca.in.model.TaskInfo;

@Repository
public interface TaskInfoRepository extends JpaRepository<TaskInfo, Long> {
	
	@Transactional
	TaskInfo save(TaskInfo taskInfo);
	
	@Transactional
	void deleteById(Long id);
	
	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_status as ts, vscca.task_info as ti ,vscca.task_user_details as tud,(select max(end_date) as end_date,task_id from vscca.task_status group by task_id) as tid where ts.task_id=tid.task_id and tid.end_date=ts.end_date and ti.id=tud.task_id and ts.task_id=ti.id and ts.status not in ('Done') order by ti.due_date asc ",nativeQuery=true)
	List<Object[]> findTaskDetails();

	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_status as ts, vscca.task_info as ti ,vscca.task_user_details as tud,\r\n"
			+ "(select max(end_date) as end_date,task_id from vscca.task_status group by task_id) as tid where ts.task_id=tid.task_id and tid.end_date=ts.end_date and ti.id=tud.task_id and ts.task_id=ti.id and tud.intimation= ? ",nativeQuery=true)
	List<Object[]> findTaskDetailsIntimation(String emailId);

	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_status as ts, vscca.task_info as ti ,vscca.task_user_details as tud,\r\n"
     + "(select max(end_date) as end_date,task_id from vscca.task_status group by task_id) as tid where ts.task_id=tid.task_id and tid.end_date=ts.end_date and ti.id=tud.task_id and ts.task_id=ti.id and tud.exceution= ? ",nativeQuery=true)
	List<Object[]> findTaskDetailsExceution(String emailId);
	
	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_status as ts, vscca.task_info as ti ,vscca.task_user_details as tud,\r\n"
			+ "(select max(end_date) as end_date,task_id from vscca.task_status group by task_id) as tid where ts.task_id=tid.task_id and tid.end_date=ts.end_date and ti.id=tud.task_id and ts.task_id=ti.id and tud.consulting= ? ",nativeQuery=true)
	List<Object[]> findTaskDetailsConsulting(String emailId);
	

	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_info as ti ,vscca.task_status as ts,vscca.task_user_details as tud  where ti.id=ts.task_id and ti.id=tud.task_id and ti.id= ? order by ts.end_date desc limit 1",nativeQuery=true)
	List<Object[]> findTaskDetailsById(String taskId);
	

	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,\r\n"
			+ "ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,\r\n"
			+ "tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_status as ts,\r\n"
			+ " vscca.task_info as ti ,vscca.task_user_details as tud,(select max(end_date) as end_date,task_id \r\n"
			+ " from vscca.task_status group by task_id) as tid where ts.task_id=tid.task_id and tid.end_date=ts.end_date\r\n"
			+ " and ti.id=tud.task_id and ts.task_id=ti.id and ? in (tud.responsibility ,tud.intimation ,tud.exceution ,tud.consulting) and ts.status not in ('Done') order by ti.due_date asc ",nativeQuery=true)
	List<Object[]> findTaskDetailsByUser(String emailId);
	
	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,\r\n"
			+ "ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,\r\n"
			+ "tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_status as ts,\r\n"
			+ " vscca.task_info as ti ,vscca.task_user_details as tud,(select max(end_date) as end_date,task_id \r\n"
			+ " from vscca.task_status group by task_id) as tid where ts.task_id=tid.task_id and tid.end_date=ts.end_date\r\n"
			+ " and ti.id=tud.task_id and ts.task_id=ti.id and ? in (tud.responsibility ,tud.intimation ,tud.exceution ,tud.consulting) and ts.status not in ('Done') and ti.due_date = CURDATE() order by ti.due_date asc",nativeQuery=true)
	List<Object[]> findTaskDetailsForUsersToday(String emailId);
	
	
	@Query(value="\r\n"
			+ "select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,\r\n"
			+ "ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,\r\n"
			+ "tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_status as ts,\r\n"
			+ " vscca.task_info as ti ,vscca.task_user_details as tud,(select max(end_date) as end_date,task_id \r\n"
			+ " from vscca.task_status group by task_id) as tid where ts.task_id=tid.task_id and tid.end_date=ts.end_date\r\n"
			+ " and ti.id=tud.task_id and ts.task_id=ti.id and ? in (tud.responsibility ,tud.intimation ,tud.exceution ,tud.consulting) and ts.status not in ('Done') and ti.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY) order by ti.due_date asc",nativeQuery=true)
	List<Object[]> findTaskDetailsForUsersWeek(String emailId);
	
	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,\r\n"
			+ "ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,\r\n"
			+ "tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_status as ts,\r\n"
			+ " vscca.task_info as ti ,vscca.task_user_details as tud,(select max(end_date) as end_date,task_id \r\n"
			+ " from vscca.task_status group by task_id) as tid where ts.task_id=tid.task_id and tid.end_date=ts.end_date\r\n"
			+ " and ti.id=tud.task_id and ts.task_id=ti.id and ? in (tud.responsibility ,tud.intimation ,tud.exceution ,tud.consulting) and ts.status not in ('Done') and ti.due_date < CURDATE() order by ti.due_date asc",nativeQuery=true)
	List<Object[]> findTaskDetailsForUsersByDueDate(String emailId);
	
	@Query(value="select * from vscca.task_info where id=?",nativeQuery=true)
	TaskInfo getById(Long id);
	
	@Query(value="select ts.task_id, ti.project_name,ti.party_name,ti.weightage,ti.task_description,ti.task_type,ti.billing_client,ti.created_at,ti.due_date,ts.status,ts.delay_reason,ts.remarks,ts.end_date,tud.responsibility,tud.intimation,tud.exceution,tud.consulting from vscca.task_status as ts, vscca.task_info as ti ,vscca.task_user_details as tud,(select max(end_date) as end_date,task_id from vscca.task_status group by task_id) as tid where ts.task_id=tid.task_id and tid.end_date=ts.end_date and ti.id=tud.task_id and ts.task_id=ti.id and ts.status='Done' and ts.end_date between ? and ?",nativeQuery=true)
	List<Object[]> findTaskDetailsDayBook(String startDate, String endDate);
}
