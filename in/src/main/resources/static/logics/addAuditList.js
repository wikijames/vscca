function todayDate(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	return today = dd + '/' + mm + '/' + yyyy;
}

$(document).ready(function(){
	var sessionTaskId = sessionStorage.getItem('taskId');
	var responsibilityStatus = false;
	var executionStatus = false;
	var consulting = false;
	var intimationStatus = false;
   
	if(sessionTaskId != null){
		$('#fileinfo').hide();
		if(responsibilityStatus && executionStatus && consulting && intimationStatus ){
		 getViewTaskById();
		}	
	}
	
$('.billingClientNameClass').select2({});
  $.ajax({
    type: "GET",
    url:getBillingClientsURL,
    dataType: "json",
	 "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
    success: function (data) {
	    $.each(data.body,function(i,obj)
        {
			var div_data="<option value="+obj.client+">"+obj.client+"</option>";
        $(div_data).appendTo('.billingClientNameClass');
        });
        }
  });

	// populate tasks Type Dropdown
  /*$.ajax({
    type: "GET",
    url:getTasksURL,
    dataType: "json",
    "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
	success: function (data) {
        $.each(data.body,function(i,obj)
        {
         var div_data="<option value="+obj.task+">"+obj.task+"</option>";
        $(div_data).appendTo('#taskType');
        });
        }
  });*/

var formattedDueDate;
$("#madeDate").change(function(){
	$('#future-date-input').val('');
	var dueDate = $(this).val();
	    var date = new Date(dueDate);
	    var month = date.getMonth() + 1;
	    var day = date.getDate();
	    var year = date.getFullYear();
		var result = day + "-" + month + "-" + year;
		formattedDueDate = dueDate;
		generateNumberDropdown(formattedDueDate);
});


 // this is the id of the form
	$("#save").click(function(e) {
	    e.preventDefault(); // avoid to execute the actual submit of the form.
		var taskId = $("#save").attr('title');
//		console.log('task id in edit', taskId);
		if(taskId !== ''){
			var settings = {
		    "url": postDSCAuditURL,
			  "method": "POST",
			  "timeout": 0,
			"headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
		  "data": JSON.stringify({
				"personName": $('#projectName').val(),
			    "active": $('#partyName').val(),
			    "createdAt": $('#weightage').val(),
			    "purpose": $('#description').val(),
			    "validity": $('#taskType').val(),
			    "validTill": $('#billingClientName').val(),
			    "category": formattedDueDate,
			    "mobileNo": $('#responsibility').val(),
			    "feesCollected": $('#intimation').val(),
			    "dscWithUs": $('#execution').val(),
			    "dscWithPerson": $('#consulting').val(),
				"remarks": $('#remarks').val(),
				"taskId": $('#taskId').val()
		  }),
		};
			$.ajax(settings).done(function (response) {

				//console.log(response);
				if(response.success == 200 ){
					$("#dscAuditForm")[0].reset();
					window.location = 'auditList/viewAuditList'
					alert('Person has been added updated in DSC audit list');
				}else if(response.success === 401 ){
					//sessionStorage.clear(); //checkSession();
					sessionStorage.clear();
				}else{
					alert('something went wrong.'+ data);
				}
			});
		}else{
			var settings = {
			    "url": postDSCAuditURL,
				  "method": "POST",
				  "timeout": 0,
				"headers": {
			    	"Content-Type": "application/json",
					"Authorization": accessToken
			  	},
			  "data": JSON.stringify({
			    "personName": $('#DSCPerson').val(),
			    "active": $('#DSCActive').val(),
			    "purpose": $('#DSCPurpose').val(),
			    "dscWithUs": $('#DSCWithUs').val(),
			    "createdAt": formattedDueDate,
			    "validity": $('#validity').val(),
			    "validTill": $('#future-date-input').val(),
			    "category": $('#category').val(),
			    "mobileNo": $('#mobileNumber').val(),
			    "feesCollected": $('#feeCollected').val(),
			    "dscWithPerson": $('#DSCWithPerson').val(),
				"remarks": $('#remarks').val(),
			  }),
			};
				$.ajax(settings).done(function (response) {

					console.log(response);
					if(response.success == 200 ){
						window.location = 'viewAuditList';
						$("#dscAuditForm")[0].reset();
						alert('Person has been added succesfully in DSC audit list');
					}else if(response.success === 401 ){
						//sessionStorage.clear(); //checkSession();
						sessionStorage.clear();
					}else{
						alert('something went wrong.');
					}
				});
		}
});
})//ready ends


function ValidateUploadFile() {
    var fileInput = document.getElementById("file");
    var filePath = fileInput.value;
       if(!filePath){
			alert('Please select a file');
		}else if (!checkFileExtension(filePath)) {
            alert('invalid file type not allowed');
            fileInput.value = '';
            return false;
		}else{
			uploadBulkTask()	
		}
};

function uploadBulkTask(){
	let formData = new FormData(document.getElementById("fileinfo"));
     
        if (confirm("Are you sure?")) {
    // your upload code
            $.ajax({
				url: postUploadBulkTaskURL,
				type: "POST",
				data: formData,
				"headers": {
	                "Authorization": accessToken
              	},
				cache: false,
	            contentType: false,
	            processData: false,
				success: function (data) {
				    $('#output').html(data);
					alert('Task has been uploaded succesfully');
					window.location = 'dashboard';
	            },
	            error: function(data) {
			      console.log('error', data);
			    }
        })
    }
		$('form')[0].reset();
		return false;
}

// generateNumberDropdown
  function generateNumberDropdown(madeDate) {
  var validitySelect = $('#validity');

  // Clear existing options
  validitySelect.empty();

  // Create the default option
  var defaultOption = $('<option>', {
    value: '',
    text: 'Select Validity in Months'
  });

  // Append the default option to the select element
  validitySelect.append(defaultOption);

  // Generate options for validity in months
  for (var i = 0; i <= 36; i++) {
    var option = $('<option>', {
      value: i,
      text: i
    });

    // Append each option to the select element
    validitySelect.append(option);
  }

  // Handle select change event
  validitySelect.on('change', function() {
    var selectedMonth = parseInt($(this).val());
    var parts = madeDate.split('-');
    var day = parseInt(parts[0]);
    var month = parseInt(parts[1]) - 1; // Month is zero-based in JavaScript Date object
    var year = parseInt(parts[2]);
    var date = new Date(year, month, day);
    date.setMonth(date.getMonth() + selectedMonth);
    var formattedDate = formatDate(date);
    $('#future-date-input').val(formattedDate);
  });
}

    // Function to format the date as "dd-mm-yyyy"
    function formatDate(date) {
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      // Pad single digits with leading zeros
      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }

      return day + '-' + month + '-' + year;
    }
