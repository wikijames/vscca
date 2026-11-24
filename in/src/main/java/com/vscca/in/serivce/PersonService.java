package com.vscca.in.serivce;

import java.util.List;

import org.springframework.stereotype.Service;

import com.vscca.in.model.BillingClient;
import com.vscca.in.model.Person;

@Service
public interface PersonService {

	
	List<Person> findAll();
}
