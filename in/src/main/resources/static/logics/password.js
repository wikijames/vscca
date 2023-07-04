$( document ).ready( function () {
    // populate User Name
    $.ajax( {
        type: "GET",
        url: getUsersURL,
        dataType: "json",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        success: function ( data ) {
            //checkSession( data.success );
            $.each( data.body, function ( i, obj ) {
                var div_data = "<option value=" + obj.emailId + ">" + obj.firstName + " " + obj.lastName + "</option>";
                $( div_data ).appendTo( '#userNames' );
            } );
        }
    } );


    // this is the id of the form
    $( "#save" ).click( function ( e ) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var password = $( '#password' ).val();
        var confirmPassword = $( '#confirmPassword' ).val();

        if(password == confirmPassword){
            if ( userRole.toLowerCase() == 'admin' ) {
                var settings = passwordChangeOptionForAdminHandler(settings);
            } else {
                var settings = userPasswordResetHandler( settings );
            }
        }else{
            alert("Password Don't match, please enter again");
        }
    } );

} )//ready ends

function userPasswordResetHandler ( settings ) {
    var settings = {
        "url": postPasswordChangeSelfURL,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        "data": JSON.stringify( {
            "password": $( '#password' ).val()
        } ),
    };
    $.ajax( settings ).done( function ( response ) {
        if ( response.success == 200 ) {
            window.location = 'dashboard';
            $( "#changePasswordForm" )[ 0 ].reset();
            alert( 'Password has been created succesfully' );
        } else if ( reponse.success === 401 ) {
            sessionStorage.clear(); //checkSession();
        } else {
            alert( 'something went wrong.' + data );
        }
    } );
    return settings;
}

function passwordChangeOptionForAdminHandler () {
    var settings = {
        "url": PostPasswordChangeURL,
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        "data": JSON.stringify( {
            "userName": $( '#userNames' ).val(),
            "password": $( '#password' ).val()
        } ),
    };
    $.ajax( settings ).done( function ( response ) {
        if ( response.success == 200 ) {
            $( "#changePasswordForm" )[ 0 ].reset();
            window.location = 'adminPanel';
            alert( 'password has been updated succesfully' );
        } else if ( reponse.success === 401 ) {
            sessionStorage.clear(); //checkSession();
        } else {
            alert( 'something went wrong.' + data );
        }
    } );
    return settings;
}

