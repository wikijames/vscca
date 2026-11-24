package com.vscca.in.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.BillingClient;
import com.vscca.in.model.Person;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
	
		List<Person> findAll();




}
