package com.vscca.in.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vscca.in.model.WorkLocation;
@Repository
public interface WorkLocationRepository extends JpaRepository<WorkLocation, Long> {

	List<WorkLocation> findAll();
}
