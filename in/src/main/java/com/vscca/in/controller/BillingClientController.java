package com.vscca.in.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.serivce.BillingClientService;

@RestController
public class BillingClientController {

	@Autowired
	BillingClientService billingClientService;
}
