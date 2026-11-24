$(document).ready(function(){

populateData();
	setTimeout(function(){
		dataTableFilterHandler ()
	},1000)
})// jquery end


function isActiveUser(value){
	if(value === 1){
		return 'Active';
	}else{
		return 'Deactive'
	}
}

function populateData(){
	//$('#table_id').dataTable().destroy();
	$('#table_id tbody').empty();
	$.ajax({
        type: "GET",
        url:getUsersProfileURL,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
			success: function (data) {
//				console.log('get user profile data view', data);
				$.each(data.body,function(i,obj)
                {
	 		  var div_data = '<tr>'
					+ '<td>' + obj.firstName + ' ' + obj.lastName +'</td>'
                    + '<td>' + obj.accessType + '</td>'
					+ '<td>' + isActiveUser(obj.isActive) + '</td>'
					+ '<td> <a onClick="redirectToProfileDetails(' + obj.id+ ')" class="btn pointer">View/Edit</a></td>'
					+ '</tr>';
			    $(div_data).appendTo('#populateGrid');
                });
            }
      });
};

function redirectToProfileDetails(id){
	window.location = 'profile';
	sessionStorage.setItem('profileId',id);
}

function dataTableFilterHandler () {
    //Data table filter
    $( '#table_id' ).DataTable( {
        dom: 'Bfrtip',
//        buttons: [
//             {
//            extend: 'excelHtml5',
//            autoFilter: true
//       		 }
//        ],
		"bPaginate": false,
		buttons: [
			'excel'
			],
    	colReorder: true,
        initComplete: function () {
            this.api().columns([0,1,2]).every( function () {
                var column = this;
                var ddmenu = cbDropdown( $( column.header() ) )
                    .on( 'change', ':checkbox', function () {
                        var active;
                        var vals = $( ':checked', ddmenu ).map( function ( index, element ) {
                            active = true;
                            return $.fn.dataTable.util.escapeRegex( $( element ).val() );
                        } ).toArray().join( '|' );

                        column
                            .search( vals.length > 0 ? '^(' + vals + ')$' : '', true, false )
                            .draw();

                        // Highlight the current item if selected.
                        if ( this.checked ) {
                            $( this ).closest( 'li' ).addClass( 'active' );
                        } else {
                            $( this ).closest( 'li' ).removeClass( 'active' );
                        }

                        // Highlight the current filter if selected.
                        var active2 = ddmenu.parent().is( '.active' );
                        if ( active && !active2 ) {
                            ddmenu.parent().addClass( 'active' );
                        } else if ( !active && active2 ) {
                            ddmenu.parent().removeClass( 'active' );
                        }
                    } );

                column.data().unique().sort().each( function ( d, j ) {
                    var // wrapped
                        $label = $( '<label>' ),
                        $text = $( '<span>', {
                            text: d
                        } ),
                        $cb = $( '<input>', {
                            type: 'checkbox',
                            value: d
                        } );

                    $text.appendTo( $label );
                    $cb.appendTo( $label );

                    ddmenu.append( $( '<li>' ).append( $label ) );
                } );
            } );
        },
    } );
};

function cbDropdown ( column ) {
    return $( '<ul>', {
        'class': 'cb-dropdown'
    } ).appendTo( $( '<div>', {
        'class': 'cb-dropdown-wrap'
    } ).appendTo( column ) );
};

