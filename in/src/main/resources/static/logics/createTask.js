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
  $.ajax({
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
  });

	// populate responsiblityUsers Dropdown
	  $.ajax({
        type: "GET",
        url:getResponsiblityUsersURL,
        dataType: "json",
        "headers": {
	    	"Content-Type": "application/json",
			"Authorization": accessToken
	  	},
		success: function (data) {
			responsibilityStatus = true;
            $.each(data.body,function(i,obj)
            {
             var div_data="<option value="+obj.emailId+">"+obj.firstName+" "+obj.lastName+"</option>";
            $(div_data).appendTo('#responsibility');
            });
            }
      });

// populate executionUsers Dropdown
  $.ajax({
    type: "GET",
    url:getExecutionUsersURL,
    dataType: "json",
    "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
	success: function (data) {
		executionStatus = true;
        $.each(data.body,function(i,obj)
        {
         var div_data="<option value="+obj.emailId+">"+obj.firstName+" "+obj.lastName+"</option>";
        $(div_data).appendTo('#execution');
        });
        }
  });

// populate consultingUsers Dropdown
  $.ajax({
    type: "GET",
    url:getConsultingUsersURL,
    dataType: "json",
    "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
	success: function (data) {
		consulting = true;
		$.each(data.body,function(i,obj)
        {
         var div_data="<option value="+obj.emailId+">"+obj.firstName+" "+obj.lastName+"</option>";
        $(div_data).appendTo('#consulting');
        });
        }
  });

// populate intimationuser Dropdown
  $.ajax({
    type: "GET",
    url:getIntimationUsersURL,
    dataType: "json",
    "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
	success: function (data) {
        intimationStatus = true;
        $.each(data.body,function(i,obj)
        {
         var div_data="<option value="+obj.emailId+">"+obj.firstName+" "+obj.lastName+"</option>";
        $(div_data).appendTo('#intimation');
        });
        }
  });



var formattedDueDate;
$("#endDate").change(function(){
	var dueDate = $(this).val();
	    var date = new Date(dueDate);
	    var month = date.getMonth() + 1;
	    var day = date.getDate();
	    var year = date.getFullYear();
		var result = day + "-" + month + "-" + year;
		formattedDueDate = dueDate;
});


 // this is the id of the form
	$("#save").click(function(e) {
	    e.preventDefault(); // avoid to execute the actual submit of the form.
		var taskId = $("#save").attr('title');
//		console.log('task id in edit', taskId);
		if(taskId !== ''){
			var settings = {
		    "url": postEditTaskURL,
			  "method": "POST",
			  "timeout": 0,
			"headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
		  "data": JSON.stringify({
			"projectName": $('#projectName').val(),
			    "partyName": $('#partyName').val(),
			    "weightage": $('#weightage').val(),
			    "taskDescription": $('#description').val(),
			    "taskType": $('#taskType').val(),
			    "billingClient": $('#billingClientName').val(),
			    //"createdAt": todayDate(),
			    "dueDate": formattedDueDate,
			    "responsibility": $('#responsibility').val(),
			    "intimation": $('#intimation').val(),
			    "exceution": $('#execution').val(),
			    "consulting": $('#consulting').val(),

			"status": $('#status').val(),
			"remarks": $('#remarks').val(),
			"delayReason": $('#reasonForDelay').val(),
			"taskId": $('#taskId').val()
		  }),
		};
			$.ajax(settings).done(function (response) {

				//console.log(response);
				if(response.success == 200 ){
					$("#createForm")[0].reset();
					window.location = 'dashboard'
					alert('Task has been updated succesfully');
				}else if(reponse.success === 401 ){
					checkSession();
					sessionStorage.clear();
				}else{
					alert('something went wrong.'+ data);
				}
			});
		}else{
			var settings = {
			    "url": postCreateTaskURL,
				  "method": "POST",
				  "timeout": 0,
				"headers": {
			    	"Content-Type": "application/json",
					"Authorization": accessToken
			  	},
			  "data": JSON.stringify({
			    "projectName": $('#projectName').val(),
			    "partyName": $('#partyName').val(),
			    "weightage": $('#weightage').val(),
			    "taskDescription": $('#description').val(),
			    "taskType": $('#taskType').val(),
			    "billingClient": $('#billingClientName').val(),
			    //"createdAt": todayDate(),
			    "dueDate": formattedDueDate,
			    "responsibility": $('#responsibility').val(),
			    "intimation": $('#intimation').val(),
			    "exceution": $('#execution').val(),
			    "consulting": $('#consulting').val()
			  }),
			};
				$.ajax(settings).done(function (response) {

					//console.log(response);
					if(response.success == 200 ){
						window.location = 'dashboard';
						$("#createForm")[0].reset();
						alert('Task has been created succesfully');
					}else if(reponse.success === 401 ){
						checkSession();
						sessionStorage.clear();
					}else{
						alert('something went wrong.'+ data);
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
