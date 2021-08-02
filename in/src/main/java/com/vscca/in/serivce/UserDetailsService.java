package com.vscca.in.serivce;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.vscca.in.model.UserDetails;

@Service
public interface UserDetailsService {
	
	UserDetails save(UserDetails userDetails);
	
	List<UserDetails> userDetailsByConsulting();
	

	List<UserDetails> userDetailsByResponsibility();
	
	
	List<UserDetails> userDetailsByExecution();
	
	

	List<UserDetails> userDetailsByIntimation();
	
	UserDetails findByEmailId(String emailId);

}
