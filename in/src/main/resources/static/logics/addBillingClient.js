var isActive = 0;

$( document ).ready( function () {
    if ( $( this ).is( ":checked" ) ) {
        $( this ).val( "1" );
        isActive = 1;
        $( '#isActiveLabel' ).text( 'Client is De-activated' );
    } else {
        $( this ).val( "0" );
        isActive = 0;
        $( '#isActiveLabel' ).text( 'Client is Activated' );
    }

    $( "#isActive" ).change( function ( e ) {
        if ( $( this ).is( ":checked" ) ) {
            $( this ).val( "1" );
            isActive = 1;
            $( '#isActiveLabel' ).text( 'Client is De-activated' );
        } else {
            $( this ).val( "0" );
            isActive = 0;
            $( '#isActiveLabel' ).text( 'Client is Activated' );
        }
    } );

    $( '#save' ).click( function ( e ) {
        e.preventDefault(); // avoid to execute the actual submit of the form.
        var settings = {
            "url": postBillingClientURL,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": accessToken
            },
            "data": JSON.stringify( {
                "personName": $( '#personName' ).val(),
                "entityName": $( '#entityName' ).val(),
                "ledgerNumber": $( '#ledgerNumber' ).val(),
                "pageNumber": $( '#pageNumber' ).val(),
                "isActive": isActive,
            } ),
        };

        $.ajax( settings ).done( function ( response ) {
            if ( response.success == 200 ) {
                $( "#billingClientForm" )[ 0 ].reset();
                alert( 'Billing client has been added succesfully' );
            } else if ( reponse.success === 401 ) {
                checkSession();
            } else {
                alert( 'something went wrong.' + data );
            }
        } );
    } );

} )// jquery end

