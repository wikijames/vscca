$(document).ready(function(){
	
	$("#responsibility").change(function(){
	    if($(this).is(":checked")){
	        $(this).val("yes");
	    } else {
	        $(this).val("no");
	    }
	});
	
	$("#execution").change(function(){
	    if($(this).is(":checked")){
	        $(this).val("yes");
	    } else {
	        $(this).val("no");;
	    }
	});
	
	$("#consulting").change(function(){
	    if($(this).is(":checked")){
	        $(this).val("yes");
	    } else {
	        $(this).val("no");;
	    }
	});
	
	$("#intimation").change(function(){
	    if($(this).is(":checked")){
	        $(this).val("yes");
	    } else {
	        $(this).val("no");;
	    }
	});
	
 // this is the id of the form
	$("#profile").click(function(e) {
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
