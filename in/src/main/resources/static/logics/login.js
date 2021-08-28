$(document).ready(function(){
 // on click Sign In Button checks with the remote server that username =='admin' and password == 'password'
    $("#login").click(function(e){
		e.preventDefault();
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
		
		$.ajax(settings).done(function (response) {
	
			if(response.success == 200){
				window.location = 'dashboard';
				Cookies.set('token', response.token, {expires: 1/1440});
				sessionStorage.setItem('token', response.token);
				sessionStorage.setItem('roles', response.body)
			}else if(response.success == 500){
				alert('Either user is not registered or there is some other issue...');
			}else{
				alert('try again');
			}
		
    });

});
});