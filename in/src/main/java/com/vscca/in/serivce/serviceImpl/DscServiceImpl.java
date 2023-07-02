package com.vscca.in.serivce.serviceImpl;

import org.springframework.beans.factory.annotation.Autowired;

import com.vscca.in.model.Dsc;
import com.vscca.in.repository.DscRepository;
import com.vscca.in.serivce.DscService;

public class DscServiceImpl implements DscService {

	@Autowired
	DscRepository dscRepository;
	
	@Override
	public Dsc save(Dsc Dsc) {
		return dscRepository.save(Dsc);
	}

}
