package com.vscca.in.serivce;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vscca.in.model.WorkLocation;

@Service
public interface WorkLocationService {
	
	List<WorkLocation> findAll();

}
