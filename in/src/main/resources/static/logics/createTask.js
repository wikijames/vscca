$(document).ready(function(){
	
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
		    "firstName": $('#firstName').val(),
		    "lastName": $('#lastName').val(),
		    "mobileNumber": $('#mobile').val(),
		    "emailId": $('#email').val(),
		    "address": $('#address').val(),
		    "city": $('#city').val(),
		    "country": $('#country').val(),
		    "postalCode": $('#postalCode').val(),
		    "responsibility": $('#responsibility').val(),
		    "execution": $('#execution').val(),
		    "consulting": $('#consulting').val(),
		    "intimation": $('#intimation').val(),
		    "aboutMe": $('#aboutMe').val(),
		    "accessType": $('#accessType').val(),
		    "location": $('#location').val()
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
