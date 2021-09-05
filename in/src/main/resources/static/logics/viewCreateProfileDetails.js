
$(document).ready(function(){
//	disableProfileFormInputHandler();
	//getViewOwnProfile();
	//$('#responsibility').prop('checked', true);
})// ready ends

function disableProfileFormInputHandler(){
//	console.log('userRole',userRole);
	if(userRole.toLowerCase() == 'admin' ){
		//$('#profileForm').find('input, textarea, button, select').attr('disabled','disabled');
		//$('#profileForm').find('input, textarea, button, select').attr('readonly','readonly');
//		getViewOwnProfile()
	}else if(userRole.toLowerCase() == 'supervisor' ){
		$('#profileForm').find('input, textarea, button, select').attr('disabled','disabled');
		$('#profileForm').find('input, textarea, button, select').attr('readonly','readonly');
		$('#saveProfile').remove();
//		getViewOwnProfile()
	}else if(userRole.toLowerCase() == 'teammember'){
		$('#profileForm').find('input, textarea, button, select').attr('disabled','disabled');
		$('#profileForm').find('input, textarea, button, select').attr('readonly','readonly');
		$('#saveProfile').remove();
//		getViewOwnProfile()
	}
};

function isCheckedType(value){
	if(value == 1){
		return true;
	}
}

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
					var obj = data.body;
					$('#accessType').val(obj.accessType);
					$('#location').val(obj.location);
					$('#firstName').val(obj.firstName);
					$('#lastName').val(obj.lastName);
					$('#email').val(obj.emailId);
					$('#mobile').val(obj.mobileNumber);
					$('#responsibility').prop('checked', isCheckedType(obj.responsibility));
					$('#execution').prop('checked', isCheckedType(obj.execution));
					$('#consulting').prop('checked', isCheckedType(obj.consulting));
					$('#intimation').porp('checked',isCheckedType(obj.intimation));
					$('#city').val(obj.city);
					$('#country').val(obj.country);
					$('#postalCode').val(obj.postalCode);
					$('#aboutMe').val(obj.aboutMe);

            }
      });

};


