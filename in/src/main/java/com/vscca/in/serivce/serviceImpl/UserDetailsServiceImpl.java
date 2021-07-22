package com.vscca.in.serivce.serviceImpl;

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

}
