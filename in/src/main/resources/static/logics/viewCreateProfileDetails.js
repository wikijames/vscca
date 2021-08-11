
$(document).ready(function(){
	disableProfileFormInputHandler();
})// ready ends

function disableProfileFormInputHandler(){
	console.log('userRole',userRole);
	if(userRole.toLowerCase() === 'admin' ){
		//$('#profileForm').find('input, textarea, button, select').attr('disabled','disabled');
		//$('#profileForm').find('input, textarea, button, select').attr('readonly','readonly');
		getViewOwnProfile()
	}else if(userRole.toLowerCase() === 'supervisor' ){
		$('#profileForm').find('input, textarea, button, select').attr('disabled','disabled');
		$('#profileForm').find('input, textarea, button, select').attr('readonly','readonly');
		getViewOwnProfile()
	}else if(userRole.toLowerCase() === 'team member'){
		$('#profileForm').find('input, textarea, button, select').attr('disabled','disabled');
		$('#profileForm').find('input, textarea, button, select').attr('readonly','readonly');
		$('#saveProfile').remove();
		getViewOwnProfile()
	}
};

function getViewOwnProfile(){
	$.ajax({
        type: "GET",
        url:getUserProfileByIdURL,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken	
		  	},
			success: function (data) {
				checkSession(data.success);
				console.log('data my profile', data);
				$.each(data.body,function(i,obj){
//					$("#accessType").attr(obj.accessType);
//					$('#location').val(obj.location);
//					$('#firstName').val(obj.firstName);
//					$('#lastName').val(obj.lastName);
//					$('#email').val(obj.emailId);
//					$('#mobile').val(obj.mobileNumber);
//					$('#responsibility').val(obj.responsibility);
//					$('#execution').val(obj.execution);
//					$('#consulting').val(obj.consulting);
//					$('#intimation').val(obj.intimation);
//					$('#city').val(obj.city);
//					$('#country').val(obj.country);
//					$('#postalCode').val(obj.postalCode);
//					$('#aboutMe').val(obj.aboutMe);
//					});
            }
      });
	
};


