package com.vscca.in.serivce.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.UserDetails;
import com.vscca.in.repository.UserDetailsRepository;
import com.vscca.in.serivce.UserDetailsService;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	UserDetailsRepository userDetailsRepository;
	
	@Override
	public UserDetails save(UserDetails userDetails) {
		// TODO Auto-generated method stub
		return userDetailsRepository.save(userDetails);
	}

	@Override
	public List<UserDetails> userDetailsByConsulting() {
		// TODO Auto-generated method stub
		return userDetailsRepository.userDetailsByConsulting();
	}

	@Override
	public List<UserDetails> userDetailsByResponsibility() {
		// TODO Auto-generated method stub
		return userDetailsRepository.userDetailsByResponsibility();
	}

	@Override
	public List<UserDetails> userDetailsByExecution() {
		// TODO Auto-generated method stub
		return userDetailsRepository.userDetailsByExecution();
	}

	@Override
	public List<UserDetails> userDetailsByIntimation() {
		// TODO Auto-generated method stub
		return userDetailsRepository.userDetailsByIntimation();
	}

	@Override
	public UserDetails findByEmailId(String emailId) {
		// TODO Auto-generated method stub
		return userDetailsRepository.findByEmailId(emailId);
	}

}
