package com.vscca.in.serivce.serviceImpl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vscca.in.model.BillingClient;
import com.vscca.in.repository.BillingClientRepository;
import com.vscca.in.serivce.BillingClientService;

@Service
public class BillingClientServiceImpl implements BillingClientService {

	@Autowired
	BillingClientRepository billingClientRepository;
	
	@Override
	public List<BillingClient> findAll() {
		// TODO Auto-generated method stub
		return billingClientRepository.findAll();
	}

	@Override
	public BillingClient save(BillingClient billingClient) {
		// TODO Auto-generated method stub
		return null;
	}

}
