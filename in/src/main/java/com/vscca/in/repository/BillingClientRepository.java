package com.vscca.in.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.BillingClient;

@Repository
public interface BillingClientRepository extends JpaRepository<BillingClient, Long>{

	List<BillingClient> findAll();
}
