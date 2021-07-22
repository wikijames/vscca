package com.vscca.in.serivce;

import org.springframework.stereotype.Service;

import com.vscca.in.model.LoginTable;

@Service
public interface LoginService {
	
LoginTable findByuserName(String username);

LoginTable save(LoginTable loginTable);


}
