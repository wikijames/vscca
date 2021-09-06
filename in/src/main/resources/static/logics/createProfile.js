var responsibilityValue = 0;
var executionValue = 0;
var consultingValue = 0;
var intimationValue = 0;
var sessionProfileId;

$(document).ready(function(){
	sessionProfileId = sessionStorage.getItem('profileId');
	if(sessionProfileId != null){
		setTimeout(function(){
			viewProfileByIdHandler();
		},1000);		
	}
console.log('vprofileId ', sessionProfileId);

    if ( $( '#isActive' ).is( ":checked" ) ) {
        $( this ).val( "1" );
        isActive = 0;
//        $( '#isActiveLabel' ).text( 'User is De-activated' );
    } else {
        $( this ).val( "0" );
        isActive = 0;
//        $( '#isActiveLabel' ).text( 'User is Activated' );
    }

    $( "#isActive" ).change( function ( e ) {
        if ( $( this ).is( ":checked" ) ) {
            $( this ).val( "1" );
            isActive = 1;
//            $( '#isActiveLabel' ).text( 'User is De-activated' );
        } else {
            $( this ).val( "0" );
            isActive = 0;
//            $( '#isActiveLabel' ).text( 'User is Activated' );
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
				$.each(data.body,function(i,obj)
	            {
					 var div_data="<option value="+obj.workLocation+">"+ obj.workLocation+"</option>";
	            $(div_data).appendTo('#location');
	            });
	            }
	      });
}

function validateEmail(){  
	var emailId = $('#email').val();
   var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;  
   if(!emailReg.test(emailId)) {  
        alert("Please enter valid email id");
		return false;
   }       
};

function submitData(e){
	    e.preventDefault();
		if(validateEmail() != false){
			console.log('profileId===',sessionProfileId)
			if(sessionProfileId != null){
				updateProfileHandler();	
				
			}else{
				createNewProfileHandler();
			}
		} 
	};
	
function updateProfileHandler(){
	var saveProfileId = $("#save").attr('title');
	var settings = {
		    "url": postEditUserDetailsURL,
			  "method": "POST",
			  "timeout": 0,
		"headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
		  "data": JSON.stringify({
		    "id": saveProfileId,
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
				alert('profile has been updated succesfully');
			}else if(reponse.success === 401 ){
				checkSession();
			}else{
				alert('something went wrong.'+ data);
			}
		});
};
	
function createNewProfileHandler(){
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

function isCheckedRes(value){
	if(value == 1){
		$('#responsibility').prop("checked", true);
		$('#responsibility').val( "1" );
		responsibilityValue = 1;
		console.log('res', value);
	}
};	
function isCheckedExe(value){
	if(value == 1){
		$('#execution').prop("checked", true);
		$('#execution').val( "1" );
		executionValue = 1;
		console.log('exees', value);
	}
};
function isCheckedCon(value){
	if(value == 1){
		$('#consulting').prop("checked", true);
		$('#consulting').val( "1" );
		consultingValue = 1;
		console.log('cons', value);
	}
};
function isCheckedInt(value){
	if(value == 1){
		$('#intimation').prop("checked", true);
		$('#intimation').val( "1" );
		intimationValue = 1;
		console.log('Ints', value);
	}
};
	
function viewProfileByIdHandler(){
		//current user email id 
		var emailId = sessionStorage.getItem('emailId');
		var id = sessionStorage.getItem('profileId');
		if(id != null){
	$.ajax({
        type: "GET",
        url:getUserDetailByIdURL+'?emailId='+emailId,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
			success: function (data) {
					var obj = data.body;
					console.log('get user profile data view', obj);
					$("#save").attr('title', obj.id);
					$('#profileId').val(obj.id);
					$('#firstName').val(obj.firstName),
				    $('#lastName').val(obj.lastName),
				    $('#mobile').val(obj.mobileNumber),
				    $('#email').val(obj.emailId),
				    $('#address').val(obj.address),
				    $('#city').val(obj.city),
				    $('#country').val(obj.country),
				    $('#postalCode').val(obj.postalCode),
//				    $("#responsibility").val(obj.responsibility)
					$("#execution").val(obj.execution),
//					$("#consulting").val(obj.consulting),
//					$("#intimation").val(obj.intimation),
				    $('#aboutMe').val(obj.aboutMe),
				    $('#accessType').val(obj.accessType),
				    $('#location').val(obj.location)
					isCheckedRes(obj.responsibility);
				    isCheckedExe(obj.execution); 
					isCheckedCon(obj.consulting);
					isCheckedInt(obj.intimation); 
//				
				setTimeout(function(){
					sessionStorage.removeItem('profileId');
				},3000)
            }
      });
	};
};