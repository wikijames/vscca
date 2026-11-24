package com.vscca.in.utill;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import com.vscca.in.dto.TaskDto;
import com.vscca.in.model.TaskInfo;
import com.vscca.in.model.TaskStatus;
import com.vscca.in.model.TaskUserDetails;

public class ExcelHelper {
	
	//public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	 // static String[] HEADERs = { "Id", "Title", "Description", "Published" };
	  static String SHEET = "task";
	  public static boolean hasExcelFormat(MultipartFile file) {
//	    if (!TYPE.equals(file.getContentType())) {
//	      return false;
//	    }
	    return true;
	  }
	 
	}



