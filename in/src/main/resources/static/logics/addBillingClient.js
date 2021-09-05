var isActive = 0;

$( document ).ready( function () {
	var billingId = sessionStorage.getItem('billingId');
	if(billingId != null || billingId != '' | billingId != undefined){
		getViewBillingClientById();		
	}else{
		alert('no id');
	}
//	
    if ( $( this ).is( ":checked" ) ) {
            $( this ).val( "1" );
            isActive = 1;
//			$( '#isActiveLabel' ).text( 'Client is Activated' );
        } else {
            $( this ).val( "0" );
            isActive = 0;
//			$( '#isActiveLabel' ).text( 'Client is De-activated' );
        }

    $( "#isActive" ).change( function ( e ) {
        if ( $( this ).is( ":checked" ) ) {
            $( this ).val( "1" );
            isActive = 1;
//			$( '#isActiveLabel' ).text( 'Client is Activated' );
        } else {
            $( this ).val( "0" );
            isActive = 0;
//			$( '#isActiveLabel' ).text( 'Client is De-activated' );
        }
    } );



    $( '#save' ).click( function ( e ) {
		e.preventDefault();
		var savebillingId = $("#save").attr('title');
		
		if(savebillingId != ''){
			 // avoid to execute the actual submit of the form.
        var settings = {
            "url": postEditBillingClientURL,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": accessToken
            },
            "data": JSON.stringify( {
				"id": savebillingId,
                "partyName": $( '#partyName' ).val(),
                "ledgerNo": $( '#ledgerNumber' ).val(),
                "pageNo": $( '#pageNumber' ).val(),
                "isActive":$( '#isActive' ).val() ,
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
		}else{
			 // avoid to execute the actual submit of the form.
        var settings = {
            "url": postAddBillingClientURL,
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": accessToken
            },
            "data": JSON.stringify( {
				"partyName": $( '#partyName' ).val(),
                "ledgerNo": $( '#ledgerNumber' ).val(),
                "pageNo": $( '#pageNumber' ).val(),
                "isActive":$( '#isActive' ).val() ,
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
		}
        
    } );

} )// jquery end


function splitClientHandler(value){
	console.log('spli', value);
	var valueSplit = value.split('-');
//	$('#partyName').val();
//	$('#ledgerNumber').val(splitClientHandler(obj.client)[1]);
//	$('#pageNumber').val(splitClientHandler(obj.client)[2]);
	return valueSplit;
}

function isActiveBilling(value){
	if(value == 1){
		$( '#isActiveLabel' ).text( 'Client is Activated' );
		return 'Active';
	}else{
		$( '#isActiveLabel' ).text( 'Client is De-activated' );
		return 'Deactive'
	}
}

	function getViewBillingClientById(){
		var id = sessionStorage.getItem('billingId');
		if(id != null){
	$.ajax({
        type: "GET",
        url:getBillingByIdURL+'?id='+id,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
			success: function (data) {
					var obj = data.body;
					$("#save").attr('title', obj.id);
					$('#billingId').val(obj.id);
					$('#partyName').val(splitClientHandler(obj.client)[0]);
					$('#ledgerNumber').val(splitClientHandler(obj.client)[1]);
					$('#pageNumber').val(splitClientHandler(obj.client)[2]);
					$('#isActive').val(obj.isActive);
				setTimeout(function(){
					sessionStorage.removeItem('billingId');
				},3000)
            }
      });
	};
};
