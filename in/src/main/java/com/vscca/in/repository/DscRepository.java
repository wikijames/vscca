package com.vscca.in.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.Dsc;
import com.vscca.in.model.UserDetails;

@Repository
public interface DscRepository extends JpaRepository<Dsc, Long> {
	
	@SuppressWarnings("unchecked")
	Dsc save(Dsc dsc);

}
