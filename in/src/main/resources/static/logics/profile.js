var responsibilityValue = 0;
var executionValue = 0;
var consultingValue = 0;
var intimationValue = 0;
var isActive = 1;

$(document).ready(function(){

    if ( $( this ).is( ":checked" ) ) {
        $( this ).val( "0" );
        isActive = 0;
        $( '#isActiveLabel' ).text( 'User is De-activated' );
    } else {
        $( this ).val( "1" );
        isActive = 1;
        $( '#isActiveLabel' ).text( 'User is Activated' );
    }

    $( "#isActive" ).change( function ( e ) {
        if ( $( this ).is( ":checked" ) ) {
            $( this ).val( "0" );
            isActive = 0;
            $( '#isActiveLabel' ).text( 'User is De-activated' );
        } else {
            $( this ).val( "1" );
            isActive = 1;
            $( '#isActiveLabel' ).text( 'User is Activated' );
        }
    } );
	$("#responsibility").change(function(e){
		if($(this).is(":checked")){
	        $(this).val("1");
			responsibilityValue = 1;
	    } else {
	        $(this).val("0");
			responsibilityValue = 0;
	    }
	});

	$("#execution").change(function(){
	    if($(this).is(":checked")){
	        $(this).val("1");
			executionValue = 1;
	    } else {
	        $(this).val("0");
			executionValue = 0;
	    }
	});

	$("#consulting").change(function(){
	    if($(this).is(":checked")){
	        $(this).val("1");
			consultingValue = 1;
	    } else {
	        $(this).val("0");
			consultingValue = 0;
	    }
	});

	$("#intimation").change(function(){
	    if($(this).is(":checked")){
	        $(this).val("1");
			intimationValue = 1;
	    } else {
	        $(this).val("0");
			intimationValue = 0;
	    }
	});


$('#saveProfile').click(function(e){

    var valid=0;
    $('#profileForm').find('input[type=text], select').each(function(){
        if($(this).val() != "") valid+=1;
    });

    if(valid){
        console.log(valid + " inputs have been filled");
		submitData(e);
        return true;
    }
    else {
        alert("error: you must fill in at least one field");
        return false;
    }
});

accessType();
locationType();
})// jquery end


function accessType(){
	 $.ajax({
	        type: "GET",
	        url:getAccessURL,
	        dataType: "json",
			 "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
	        success: function (data) {
				checkSession(data.success);
		        $.each(data.body,function(i,obj)
	            {
	             var div_data="<option value="+obj.acessType+">"+ obj.acessType +"</option>";
	            $(div_data).appendTo('#accessType');
	            });
	            }
	      });
}
function locationType(){
	 $.ajax({
	        type: "GET",
	        url:getLocationURL,
	        dataType: "json",
			 "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
	        success: function (data) {
				checkSession(data.success);

			    $.each(data.body,function(i,obj)
	            {
					 var div_data="<option value="+obj.workLocation+">"+ obj.workLocation+"</option>";
	            $(div_data).appendTo('#location');
	            });
	            }
	      });
}

function submitData(e){
	    e.preventDefault(); // avoid to execute the actual submit of the form.
		var settings = {
		    "url": postProfileURL,
			  "method": "POST",
			  "timeout": 0,
		"headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
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
		    "responsibility": responsibilityValue,
		    "execution": executionValue,
		    "consulting": consultingValue,
		    "intimation": intimationValue,
		    "aboutMe": $('#aboutMe').val(),
		    "accessType": $('#accessType').val(),
		    "location": $('#location').val()
		  }),
		};

		$.ajax(settings).done(function (response) {
			if(response.success == 200 ){
				$("#profileForm")[0].reset();
				alert('profile has been added succesfully');
			}else if(reponse.success === 401 ){
				checkSession();
			}else{
				alert('something went wrong.'+ data);
			}
		});
	};