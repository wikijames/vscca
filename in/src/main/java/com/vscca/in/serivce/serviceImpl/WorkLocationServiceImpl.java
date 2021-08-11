package com.vscca.in.serivce.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.WorkLocation;
import com.vscca.in.repository.WorkLocationRepository;
import com.vscca.in.serivce.WorkLocationService;

@Service
public class WorkLocationServiceImpl implements WorkLocationService {
	
	@Autowired
	WorkLocationRepository workLocationRepository;

	@Override
	public List<WorkLocation> findAll() {
		// TODO Auto-generated method stub
		return workLocationRepository.findAll();
	}

}
