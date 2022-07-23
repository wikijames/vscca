var isActiveValue;
$( document ).ready( function () {
	var sessionBillingId = sessionStorage.getItem('billingId');
	if(sessionBillingId != null){
		setTimeout(function(){
			getViewBillingClientById();
		},500);	
	}
//	
    if ( $( '#isActive' ).is( ":checked" ) ) {
            $( this ).val( "1" );
            isActiveValue = 1;
//			$( '#isActiveLabel' ).text( 'Client is Activated' );
        } else {
            $( this ).val( "0" );
            isActiveValue = 0;
//			$( '#isActiveLabel' ).text( 'Client is De-activated' );
        }

    $( "#isActive" ).change( function ( e ) {
        if ( $( this ).is( ":checked" ) ) {
            $( this ).val( "1" );
            isActiveValue = 1;
//			$( '#isActiveLabel' ).text( 'Client is Activated' );
        } else {
            $( this ).val( "0" );
            isActiveValue = 0;
//			$( '#isActiveLabel' ).text( 'Client is De-activated' );
        }
    } );



    $( '#save' ).click( function ( e ) {
		e.preventDefault();
		if(sessionBillingId != null){
			 updateBillingClientHandler()
		}else{
			addBillingClientHandler()
		}
    });

} )// jquery end

function updateBillingClientHandler(){
	        var savebillingId = $("#save").attr('title');
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
                "isActive":$( '#isActive' ).val(),
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
};
function addBillingClientHandler(){
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
};
function splitClientHandler(value){
	console.log('spli', value);
	var valueSplit = value.split('-');
//	$('#partyName').val();
//	$('#ledgerNumber').val(splitClientHandler(obj.client)[1]);
//	$('#pageNumber').val(splitClientHandler(obj.client)[2]);
	return valueSplit;
}

//function isActiveBilling(value){
//	if(value == 1){
//		$( '#isActiveLabel' ).text( 'Client is Activated' );
//		return 'Active';
//	}else{
//		$( '#isActiveLabel' ).text( 'Client is De-activated' );
//		return 'Deactive'
//	}
//}

function isCheckedActive(value){
	if(value == 1){
		$('#isActive').prop("checked", true);
		$('#isActive').val( "1" );
		isActiveValue = 1;
		console.log('Ints', value);
	}
};
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
					isCheckedActive(obj.isActive);
//					$('#isActive').val(obj.isActive);
				setTimeout(function(){
					sessionStorage.removeItem('billingId');
				},3000)
            }
      });
	};
};



function uploadBulkBillingClients(event){
     let formData = new FormData(document.getElementById("billingFileinfo"));
     
        if (confirm("Are you sure?")) {
    // your upload code
            $.ajax({
				url: postUploadBulkBillingClientsURL,
				type: "POST",
				data: formData,
				"headers": {
	                "Authorization": accessToken
              	},
				cache: false,
	            contentType: false,
	            processData: false,
				success: function (data) {
				    $('#output').html(data);
					alert('Billing clients has been uploaded succesfully');
					window.location = 'dashboard';
	            },
	            error: function(data) {
			      console.log('error', data);
			    }
        })
    }
		$('form')[0].reset();
		return false;
}
