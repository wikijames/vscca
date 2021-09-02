package com.vscca.in.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.BillingClient;

@Repository
public interface BillingClientRepository extends JpaRepository<BillingClient, Long>{


//	@Query(value="select vbc.client from vscca.billing_client as vbc where client %?%",nativeQuery=true)
//	List<BillingClient> findAll( String client);
	
	List<BillingClient> findAll();
}
