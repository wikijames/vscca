package com.vscca.in.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.TaskInfo;
import com.vscca.in.model.UserDetails;

@Repository
public interface UserDetailsRepository extends JpaRepository<UserDetails, Long>{

	UserDetails save(UserDetails userDetails);
	
	UserDetails findByEmailId(String emailId);
	
	List<UserDetails>findAll();
	
	@Query(value="select * from vscca.user_details where consulting= 1 and is_active = 1",nativeQuery=true)
	List<UserDetails> userDetailsByConsulting();
	
	
	@Query(value="select * from vscca.user_details where responsibility= 1 and is_active = 1",nativeQuery=true)
	List<UserDetails> userDetailsByResponsibility();
	
	
	@Query(value="select * from vscca.user_details where execution= 1 and is_active = 1",nativeQuery=true)
	List<UserDetails> userDetailsByExecution();
	
	

	@Query(value="select * from vscca.user_details where intimation= 1 and is_active = 1",nativeQuery=true)
	List<UserDetails> userDetailsByIntimation();
	
	@Query(value="select * from vscca.user_Details where id=?",nativeQuery=true)
	UserDetails getById(Long id);
	
}
