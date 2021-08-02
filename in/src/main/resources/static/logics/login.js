$(document).ready(function(){
 // on click Sign In Button checks with the remote server that username =='admin' and password == 'password'
    $("#login").click(function(e){
		e.preventDefault();
		console.log('test')
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
                sessionStorage.setItem('token', response.token);
				sessionStorage.setItem('roles', response.body)
			}else{
				
				alert('try again');
			}
		
    });

});
});