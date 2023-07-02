package com.vscca.in.serivce.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.Dsc;
import com.vscca.in.repository.DscRepository;
import com.vscca.in.serivce.DscService;

@Service
public class DscServiceImpl implements DscService {

	@Autowired
	DscRepository dscRepository;
	
	@Override
	public Dsc save(Dsc Dsc) {
		return dscRepository.save(Dsc);
	}

	@Override
	public List<Dsc> findAll() {
		// TODO Auto-generated method stub
		return dscRepository.findAll();
	}

}
