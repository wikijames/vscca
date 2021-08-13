
$(document).ready(function(){
	$('#profileFormMy').find('input, textarea, button, select').attr('disabled','disabled');
	$('#profileFormMy').find('input, textarea, button, select').attr('readonly','readonly');
	getViewOwnProfile();
	//$('#responsibility').prop('checked', true);
})// ready ends

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
					$('#accessTypeMy').val(obj.accessType);
					$('#locationMy').val(obj.location);
					$('#firstNameMy').val(obj.firstName);
					$('#lastNameMy').val(obj.lastName);
					$('#emailMy').val(obj.emailId);
					$('#mobileMy').val(obj.mobileNumber);
					$('#responsibilityMy').prop('checked', isCheckedType(obj.responsibility));
					$('#executionMy').prop('checked', isCheckedType(obj.execution));
					$('#consultingMy').prop('checked', isCheckedType(obj.consulting));
					$('#intimationMy').prop('checked', isCheckedType(obj.intimation));
					$('#cityMy').val(obj.city);
					$('#countryMy').val(obj.country);
					$('#postalCodeMy').val(obj.postalCode);
					$('#aboutMeMy').val(obj.aboutMe);
					
            }
      });
	
};


