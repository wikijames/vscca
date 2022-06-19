package com.vscca.in.serivce;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vscca.in.model.BillingClient;

@Service
public interface BillingClientService {
	
	List<BillingClient> findAll();
	
	List<BillingClient> findAllByAdmin();
	
	BillingClient save(BillingClient billingClient);
	
	BillingClient getById(Long id);

}
