$(document).ready(function() {
	 $("#email").focus();
	 $('#email,#password').keyup(function(e){	
		if(e.which == 13){//Enter key pressed
            $("#login").trigger('click');//Trigger login button click event
        }
    });
    	
	// on click Sign In Button checks with the remote server that username =='admin' and password == 'password'
	$("#login").click(function(e) {
		e.preventDefault();
		var userName = $('#email').val();
		var password = $('#password').val();
		
		var settings = {
			"url": postLoginURL,
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Content-Type": "application/json",
			},
			"data": JSON.stringify({
				"userName": $('#email').val(),
				"password": $('#password').val()
			}),
		};
		if(userName === '' && password === ''){
			$(userName).css("border-color", "red");
			$(userName).focus();
			alert('Please fill the details...');
			return false;
		}
		if(!userName){
			$(userName).css("border-color", "red");
			$(userName).focus();
			alert('Please fill correct user/email');
			return false;
		}
		if(!password){
			$(password).css("border-color", "red");
			$(password).focus();
			alert('Please fill correct password');
			return false;
		}
		if(userName && password){
			$.ajax(settings).done(function(response) {
				console.log(response.success +'====='+ response.status);
				loginResponseHandler(response);			
			});		
		}
	});
	

});

function loginResponseHandler(response){
	try{
		window.location = 'dashboard';
		Cookies.set('token', response.token, { expires: 43200 / 43200 });
		sessionStorage.setItem('token', response.token);
		sessionStorage.setItem('roles', response.body)
	}catch(err){
		alert(err.message);
	}
};