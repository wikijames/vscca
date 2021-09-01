package com.vscca.in.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "access")
public class Access {
	
	@Id
	@GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY)
	private long Id;

	@Column(name="access_type", length=50, nullable=false, unique=true)
	private String acessType;

	public long getId() {
		return Id;
	}

	public void setId(long id) {
		Id = id;
	}

	public String getAcessType() {
		return acessType;
	}

	public void setAcessType(String acessType) {
		this.acessType = acessType;
	}
	
	
	

}
