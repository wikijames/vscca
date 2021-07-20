package com.vscca.in.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.LoginTable;

@Repository
public interface LoginRepository  extends JpaRepository<LoginTable, Long>  {
	
	
	LoginTable findByUserName(String userName);

}
