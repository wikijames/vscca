package com.vscca.in.serivce.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.Access;
import com.vscca.in.repository.AccessRepository;
import com.vscca.in.serivce.AccessService;

@Service
public class AccessServiceImpl implements AccessService {
	@Autowired
	AccessRepository accessRepository;

	@Override
	public List<Access> findAll() {
		return accessRepository.findAll();
	}

}
