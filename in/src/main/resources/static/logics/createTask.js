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



    let dueDate;
    $('#endDate').change(function () {
        dueDate = $(this).val();
    });

    $('#save').click(function (event) {
        event.preventDefault();
        saveTask($('#save').attr('title') !== '', dueDate);
    });
});

function saveTask(isEditing, dueDate) {
    const payload = {
        projectName: $('#projectName').val(),
        partyName: $('#partyName').val(),
        weightage: $('#weightage').val(),
        taskDescription: $('#description').val(),
        taskType: $('#taskType').val(),
        billingClient: $('#billingClientName').val(),
        dueDate,
        responsibility: $('#responsibility').val(),
        intimation: $('#intimation').val(),
        exceution: $('#execution').val(),
        consulting: $('#consulting').val()
    };
    if (isEditing) {
        payload.status = $('#status').val();
        payload.remarks = $('#remarks').val();
        payload.delayReason = $('#reasonForDelay').val();
        payload.taskId = $('#taskId').val();
    }

    function showSaveFailure(status) {
        if (status === 401) {
            sessionStorage.clear();
            alert('Your session is no longer authorized. Sign in again before saving.');
        } else if (status === 403) {
            alert('You do not have permission to save this task.');
        } else {
            alert('Unable to save the task.');
        }
    }

    $.ajax({
        url: isEditing ? postEditTaskURL : postCreateTaskURL,
        method: 'POST',
        contentType: 'application/json',
        headers: { Authorization: accessToken },
        data: JSON.stringify(payload)
    }).done(function (response) {
        const status = Number(response && response.success);
        if (status !== 200) {
            showSaveFailure(status);
            return;
        }

        $('#createForm')[0].reset();
        alert(isEditing ? 'Task updated successfully.' : 'Task created successfully.');
        window.location = 'dashboard';
    }).fail(function (request) {
        showSaveFailure(request.status);
    });
}

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
