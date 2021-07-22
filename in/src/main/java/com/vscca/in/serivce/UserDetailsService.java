package com.vscca.in.serivce;

import org.springframework.stereotype.Service;

import com.vscca.in.model.UserDetails;

@Service
public interface UserDetailsService {
	
	UserDetails save(UserDetails userDetails);

}
