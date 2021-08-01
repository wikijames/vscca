function GetFormattedDate() {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return day + "/" + month + "/" + year;
}

function todayDate(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	
	return today = dd + '/' + mm + '/' + yyyy;
}

$(document).ready(function(){
	console.log('todayDate()',todayDate())
		// populate billingClients Dropdown
		  $.ajax({
            type: "GET",
            url:"http://localhost:8080/vscca/billingClients",
            dataType: "json",
            success: function (data) {
			console.log('billingClients',data.body)
                $.each(data.body,function(i,obj)
                {
                 var div_data="<option value="+obj.emailId+">"+obj.firstName+" "+obj.lastName+"</option>";
                $(div_data).appendTo('#billingClientName'); 
                });  
                }
          });

		// populate tasks Type Dropdown
		  $.ajax({
            type: "GET",
            url:"http://localhost:8080/vscca/tasks",
            dataType: "json",
            success: function (data) {
			console.log('task type',data.body)
                $.each(data.body,function(i,obj)
                {
                 var div_data="<option value="+obj.id+">"+obj.value+"</option>";
                $(div_data).appendTo('#taskType'); 
                });  
                }
          });

		// populate responsiblityUsers Dropdown
		  $.ajax({
            type: "GET",
            url:"http://localhost:8080/vscca/responsiblityUsers",
            dataType: "json",
            success: function (data) {
			console.log('responsiblityUsers',data.body)
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
            url:"http://localhost:8080/vscca/executionUsers",
            dataType: "json",
            success: function (data) {
			console.log('executionUsers',data.body)
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
            url:"http://localhost:8080/vscca/consultingUsers",
            dataType: "json",
            success: function (data) {
			console.log('consultingUsers',data.body)
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
            url:"http://localhost:8080/vscca/intimationUsers",
            dataType: "json",
            success: function (data) {
			console.log('intimationuser',data.body)
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
				var result = day + "/" + month + "/" + year;
				formattedDueDate = result;
				console.log('v result', result);
			    return result;			
		})


 // this is the id of the form
	$("#save").click(function(e) {
	    e.preventDefault(); // avoid to execute the actual submit of the form.
		var settings = {
		    "url": "http://localhost:8080/vscca/userDetails",
			  "method": "POST",
			  "timeout": 0,
			 "headers": {
			"Authorisation" : sessionStorage.getItem('token'),
		    "Content-Type": "application/json"
		  },
		  "data": JSON.stringify({
		    "projectName": $('#projectName').val(),
		    "partyName": $('#partyName').val(),
		    "weightage": $('#weightage').val(),
		    "taskDescription": $('#description').val(),
		    "taskType": $('#taskType').val(),
		    "billingClient": $('#billingClientName').val(),
		    "createdAt": todayDate(),
		    "dueDate": formattedDueDate,
		    "responsibility": $('#responsibility').val(),
		    "intimation": $('#intimation').val(),
		    "exceution": $('#execution').val(),
		    "consulting": $('#consulting').val()
		  }),
		}; 

		$.ajax(settings).done(function (response) {

			console.log(response);		  
			if(response.success == 200 ){
				alert('profile has been added succesfully');
			}else{
				alert('something went wrong.'+ data);
			}
		});
});
})
