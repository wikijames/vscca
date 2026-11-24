var isActiveValue;
$( document ).ready( function () {
	var sessionBillingId = sessionStorage.getItem('billingId');
	if(sessionBillingId != null){
		$('#billingFileinfo').hide();
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



    $('#save').click(function (event) {
        event.preventDefault();
        saveBillingClient(sessionBillingId !== null);
    });
});

function saveBillingClient(isEditing) {
    const payload = {
        partyName: $('#partyName').val(),
        ledgerNo: $('#ledgerNumber').val(),
        pageNo: $('#pageNumber').val(),
        isActive: $('#isActive').val()
    };
    if (isEditing) {
        payload.id = $('#save').attr('title');
    }

    function showSaveFailure(status) {
        if (status === 401) {
            sessionStorage.clear();
            alert('Your session is no longer authorized. Sign in again before saving.');
        } else {
            alert('Unable to save the billing client.');
        }
    }

    $.ajax({
        url: isEditing ? postEditBillingClientURL : postAddBillingClientURL,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: accessToken
        },
        data: JSON.stringify(payload)
    }).done(function (response) {
        const status = Number(response && response.success);
        if (status !== 200) {
            showSaveFailure(status);
            return;
        }

        $('#billingClientForm')[0].reset();
        window.location = 'viewBillingClient';
        alert(isEditing ? 'Billing client updated successfully.' : 'Billing client added successfully.');
    }).fail(function (request) {
        showSaveFailure(request.status);
    });
}

function splitClientHandler(value){
	//console.log('spli', value);
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
		//console.log('Ints', value);
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


function ValidateBillingUploadFile() {
    var fileInput = document.getElementById("file");
    var filePath = fileInput.value;
       if(!filePath){
			alert('Please select a file');
		}else if (!checkFileExtension(filePath)) {
            alert('invalid file type not allowed');
            fileInput.value = '';
            return false;
		}else{
			uploadBulkBillingClients();	
		}
};

function uploadBulkBillingClients(){
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
