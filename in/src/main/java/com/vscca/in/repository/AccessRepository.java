package com.vscca.in.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.Access;



@Repository
public interface AccessRepository extends JpaRepository<Access, Long>{
	
	List<Access> findAll();

}
