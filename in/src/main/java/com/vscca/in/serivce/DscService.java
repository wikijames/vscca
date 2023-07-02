package com.vscca.in.serivce;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vscca.in.model.Dsc;
import com.vscca.in.model.UserDetails;

@Service
public interface DscService {

	
	Dsc save(Dsc Dsc);
	
	List <Dsc> findAll();
}
