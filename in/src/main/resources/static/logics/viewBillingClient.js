$( document ).ready( function () {
	populateData();
} )// jquery end

function splitClientHandler(value){
	var valueSplit = value.split('-');
	return valueSplit;
}

function isActiveBilling(value){
	if(value == 1){
		return 'Active';
	}else{
		return 'Deactive'
	}
}

function populateData () {
    //$('#table_id').dataTable().destroy();
    $( '#table_id tbody' ).empty();
    $.ajax( {
        type: "GET",
        url: getBillingClientsURL,
        dataType: "json",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        success: function ( data ) {
            checkSession( data.success );
			console.log('billing client data', data)
            $.each( data.body, function ( i, obj ) {
					splitClientHandler(obj.client);
                var div_data = '<tr>'
					
                    + '<td>' + splitClientHandler(obj.client)[0]+ '</td>'
                    + '<td>' + splitClientHandler(obj.client)[1] + '</td>'
                    + '<td>' + splitClientHandler(obj.client)[2] + '</td>'
					+ '<td>' + isActiveBilling(obj.isActive) + '</td>'
                    + '<td> <a onClick="redirectToBillingClient(' + obj.id + ')" class="btn pointer">View/Edit</a></td>'
                    + '</tr>';
                $( div_data ).appendTo( '#populateGrid' );
                
            } );
        }
    } );
};

function redirectToBillingClient ( id ) {
    window.location = 'addBillingClient';
    sessionStorage.setItem( 'billingId', id );
}
