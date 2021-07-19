$(document).ready(function(){
 // on click Sign In Button checks with the remote server that username =='admin' and password == 'password'
    $("#login").click(function(e){
		e.preventDefault();
		
        $.ajax({
            url: 'http://www.vscca.com/checklogin?user='+encodeURIComponent($("#email").val())+'&pass='+encodeURIComponent($("#password").val()),
            success:function(data){
                if(data == "200")
                {
                 // success will login to dashboard   
                }
                else
                {
					window.location = '/vscca/dashboard.html';
                    alert("Please try again");
                }
            }
        });
    });

    $("#logout").click(function() {
        $("form")[0].reset();
        $("#first").show();
        $("#second").hide();
    });
});