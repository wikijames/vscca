package com.vscca.in.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RestController;


import com.vscca.in.utill.ExcelHelper;

@RestController
public class ExcelController {
	
	 // @Autowired
	 // ExcelService fileService;
	
	  @PostMapping("/upload")
	  public Boolean uploadFile(@RequestBody MultipartFile file) {
	    String message = "";
	    if (ExcelHelper.hasExcelFormat(file)) {
	    	return true;
	    }
//	      try {
//	       // fileService.save(file);
//	        message = "Uploaded the file successfully: " + file.getOriginalFilename();
//	        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
//	      } catch (Exception e) {
//	        message = "Could not upload the file: " + file.getOriginalFilename() + "!";
//	        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
//	      }
//	    }
//	    message = "Please upload an excel file!";
	    return false;
	  }

}
