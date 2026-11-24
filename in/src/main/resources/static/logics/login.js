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
		 if (userName === '' && password === '') {
        alert('Please fill in the details');
        return false;
	    } else if (!userName) {
	        alert('Please fill in the correct user/email');
	        return false;
	    } else if (!password) {
	        alert('Please fill in the correct password');
	        return false;
	    } else if (userName && password) {
	        $.ajax(settings).done(function(response) {
	            if (response.success === 200) {
	                window.location = 'dashboard';
	                sessionStorage.setItem('token', response.token);
	                sessionStorage.setItem('roles', response.body);
	            } else {
	                if (response.success === 500) {
	                    alert('Server error. Please try again later.');
	                } else {
	                    alert('Invalid username or password. Please try again.');
	                }
	            }
	        }).fail(function() {
	            alert('Error occurred. Either userName or Passowrd is wrong. Please try again later.');
	        });
	    }
	});
	

});

function loginResponseHandler(response) {
    if (response.success === 200) {
        window.location = 'dashboard';
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('roles', response.body);
    } else {
        alert('Invalid username or password. Please try again.');
    }
}