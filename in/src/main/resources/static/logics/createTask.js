function todayDate(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	return today = dd + '/' + mm + '/' + yyyy;
}

//function showContainer(){
//	if(roles === 'admin'){
//		$('.show-container').show();
//	}else if(role === 'team'){
//		$('.show-container').hide();
//	}
//}

$(document).ready(function(){
	//console.log('todayDate()',todayDate())
		// populate billingClients Dropdown

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
				console.log('billing client get data = ', data);
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
				checkSession(data.success);
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
				checkSession(data.success);
			//console.log('responsiblityUsers',data.body)
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
				checkSession(data.success);
			//console.log('executionUsers',data.body)
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
				checkSession(data.success);
			//console.log('consultingUsers',data.body)
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
				checkSession(data.success);
			//console.log('intimationuser',data.body)
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
//            console.log('duedate',dueDate);
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
					window.location = 'viewTaskGrid'
					alert('Task has been updated succesfully');
				}else if(reponse.success === 401 ){
					checkSession();
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
						window.location = 'viewTaskGrid';
						$("#createForm")[0].reset();
						alert('Task has been created succesfully');
					}else if(reponse.success === 401 ){
						checkSession();
					}else{
						alert('something went wrong.'+ data);
					}
				});
		}


});
})//ready ends
