package com.vscca.in.serivce.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.LoginTable;
import com.vscca.in.repository.LoginRepository;
import com.vscca.in.serivce.LoginService;

@Service
public class LoginServiceImpl implements LoginService{
	@Autowired
	LoginRepository loginRepository;
	
	@Override
	public LoginTable findByuserName(String username) {
		// TODO Auto-generated method stub
		LoginTable loginTable=loginRepository.findByUserName(username);
		return loginTable;
	}

}
