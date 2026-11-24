var responsibilityValue = 0;
var executionValue = 0;
var consultingValue = 0;
var intimationValue = 0;
var sessionProfileId;
var isActiveValue;

$(document).ready(function(){
	
	sessionProfileId = sessionStorage.getItem('profileId');
    if (sessionProfileId != null) {
        $('.messageOnCreateUser').hide();
    } else {
        $('#IsActiveUserHolder').hide();
    }
//console.log('vprofileId ', sessionProfileId);

    if ( $( '#isActive' ).is( ":checked" ) ) {
        $( this ).val( "1" );
        isActiveValue = 1;
        $( '#isActiveLabel' ).text( 'User is Active' );
    } else {
        $( this ).val( "0" );
        isActiveValue = 0;
        $( '#isActiveLabel' ).text( 'User is Deactive' );
    }

    $( "#isActive" ).change( function ( e ) {
        if ( $( this ).is( ":checked" ) ) {
            $( this ).val( "1" );
            isActiveValue = 1;
            $( '#isActiveLabel' ).text( 'User is Active' );
        } else {
            $( this ).val( "0" );
            isActiveValue = 0;
            $( '#isActiveLabel' ).text( 'User is Deactive' );
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
        //console.log(valid + " inputs have been filled");
		submitData(e);
        return true;
    }
    else {
        alert("error: you must fill in at least one field");
        return false;
    }
});

    let pendingOptions = 2;
    function onOptionsLoaded() {
        pendingOptions -= 1;
        if (pendingOptions === 0 && sessionProfileId != null) {
            viewProfileByIdHandler(sessionProfileId);
        }
    }
    loadProfileOptions('accessType', getAccessURL, 'acessType', onOptionsLoaded);
    loadProfileOptions('location', getLocationURL, 'workLocation', onOptionsLoaded);
});

function loadProfileOptions(selectId, url, valueField, onLoaded) {
    function showLoadFailure() {
        alert('Unable to load profile options. Reopen the form and try again.');
    }
    $.ajax({
        type: 'GET',
        url,
        dataType: 'json',
        headers: { Authorization: accessToken },
        success: function (response) {
            if (!response || !Array.isArray(response.body)) {
                showLoadFailure();
                return;
            }
            const select = document.getElementById(selectId);
            response.body.forEach(function (entry) {
                const value = entry && entry[valueField];
                if (typeof value === 'string') {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                }
            });
            onLoaded();
        },
        error: showLoadFailure
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

function submitData(event) {
    event.preventDefault();
    if (validateEmail() !== false) {
        saveProfile(sessionProfileId != null);
    }
}

function saveProfile(isEditing) {
    const id = isEditing ? $('#saveProfile').attr('title') : null;
    if (isEditing && !id) {
        alert('The profile details are unavailable. Reopen the profile before saving.');
        return;
    }


    const payload = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        mobileNumber: $('#mobile').val(),
        emailId: $('#email').val(),
        address: $('#address').val(),
        city: $('#city').val(),
        country: $('#country').val(),
        postalCode: $('#postalCode').val(),
        responsibility: responsibilityValue,
        execution: executionValue,
        consulting: consultingValue,
        intimation: intimationValue,
        aboutMe: $('#aboutMe').val(),
        accessType: $('#accessType').val(),
        location: $('#location').val()
    };
    if (isEditing) {
        payload.id = id;
        payload.isActive = $('#isActive').val();
    }

    function showSaveFailure(status) {
        if (status === 401) {
            sessionStorage.clear();
            alert('Your session is no longer authorized. Sign in again before saving.');
        } else if (status === 403) {
            alert('You do not have permission to save this profile.');
        } else {
            alert('Unable to save the profile.');
        }
    }

    $.ajax({
        url: isEditing ? postEditUserDetailsURL : postProfileURL,
        method: 'POST',
        contentType: 'application/json',
        headers: { Authorization: accessToken },
        data: JSON.stringify(payload)
    }).done(function (response) {
        const status = Number(response && response.success);
        if (status !== 200) {
            showSaveFailure(status);
            return;
        }

        $('#profileForm')[0].reset();
        window.location = 'viewProfileGrid';
        alert(isEditing ? 'Profile updated successfully.' : 'Profile added successfully.');
    }).fail(function (request) {
        showSaveFailure(request.status);
    });
}

function isCheckedRes(value){
	if(value == 1){
		$('#responsibility').prop("checked", true);
		$('#responsibility').val( "1" );
		responsibilityValue = 1;
		//console.log('res', value);
	}
};	
function isCheckedExe(value){
	if(value == 1){
		$('#execution').prop("checked", true);
		$('#execution').val( "1" );
		executionValue = 1;
		//console.log('exees', value);
	}
};
function isCheckedCon(value){
	if(value == 1){
		$('#consulting').prop("checked", true);
		$('#consulting').val( "1" );
		consultingValue = 1;
		//console.log('cons', value);
	}
};
function isCheckedInt(value){
	if(value == 1){
		$('#intimation').prop("checked", true);
		$('#intimation').val( "1" );
		intimationValue = 1;
		
	}
};
function isCheckedActive(value){
	if(value == 1){
		$('#isActive').prop("checked", true);
		$('#isActive').val( "1" );
		isActiveValue = 1;
		$( '#isActiveLabel' ).text( 'User is Active' );
	}
};

	
function viewProfileByIdHandler(id) {
    const failureMessage = 'Unable to load the profile. Reopen it and try again.';
    $.ajax({
        type: 'GET',
        url: getUserDetailByIdURL,
        data: { id },
        dataType: 'json',
        headers: { Authorization: accessToken },
        success: function (response) {
            const profile = response && response.body;
            if (Number(response && response.success) !== 200 || !profile || !profile.id) {
                alert(failureMessage);
                return;
            }

            $('#profileId').val(profile.id);
            $('#firstName').val(profile.firstName);
            $('#lastName').val(profile.lastName);
            $('#mobile').val(profile.mobileNumber);
            $('#email').val(profile.emailId);
            $('#address').val(profile.address);
            $('#city').val(profile.city);
            $('#country').val(profile.country);
            $('#postalCode').val(profile.postalCode);
            $('#aboutMe').val(profile.aboutMe);
            $('#accessType').val(profile.accessType);
            $('#location').val(profile.location);
            isCheckedActive(profile.isActive);
            isCheckedRes(profile.responsibility);
            isCheckedExe(profile.execution);
            isCheckedCon(profile.consulting);
            isCheckedInt(profile.intimation);
            $('#saveProfile').attr('title', profile.id);
            if (sessionStorage.getItem('profileId') === id) {
                sessionStorage.removeItem('profileId');
            }
        },
        error: function () {
            alert(failureMessage);
        }
    });
}
