var isActive = 1;

$( document ).ready( function () {
	populateData();
    if ( $( this ).is( ":checked" ) ) {
        $( this ).val( "0" );
        isActive = 0;
        $( '#isActiveLabel' ).text( 'Client is De-activated' );
    } else {
        $( this ).val( "1" );
        isActive = 1;
        $( '#isActiveLabel' ).text( 'Client is Activated' );
    }

    $( "#isActive" ).change( function ( e ) {
        if ( $( this ).is( ":checked" ) ) {
            $( this ).val( "0" );
            isActive = 0;
            $( '#isActiveLabel' ).text( 'Client is De-activated' );
        } else {
            $( this ).val( "1" );
            isActive = 1;
            $( '#isActiveLabel' ).text( 'Client is Activated' );
        }
    } );

} )// jquery end

function populateData () {
    //$('#table_id').dataTable().destroy();
    $( '#table_id tbody' ).empty();
    var count = 0;
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
                count++;
                var div_data = '<tr>'
                    + '<td>' + obj.projectName + '</td>'
                    + '<td>' + obj.partyName + '</td>'
                    + '<td>' + obj.weightage + '</td>'
                    + '<td>' + obj.responsibilityName + '</td>'
					+ '<td>' + obj.exceutionName + '</td>'
					+ '<td>' + obj.intimationName + '</td>'
					+ '<td>' + obj.consultingName + '</td>'
                    + '<td>' + formatDateHandler( obj.dueDate ) + '</td>'
                    + '<td>' + isTaskDescription( obj.taskDescription ) + '</td>'
                    + '<td>' + obj.status + '</td>'
                    + '<td> <a onClick="redirectToTaskDetails(' + obj.taskId + ')" class="btn pointer">View</a></td>'
                    + '</tr>';
                $( div_data ).appendTo( '#populateGrid' );
                
            } );
        }
    } );
};
