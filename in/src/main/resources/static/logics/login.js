$(document).ready(function(){
 // on click Sign In Button checks with the remote server that username =='admin' and password == 'password'
    $("#login").click(function(e){
		e.preventDefault();
		console.log('test')
		var settings = {
		  "url": "http://localhost:8080/vscca/login",
		  "method": "POST",
		  "timeout": 0,
		  "headers": {
		    "Content-Type": "application/json"
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
			}else{
				
				alert('try again');
			}
		
    });

});
});