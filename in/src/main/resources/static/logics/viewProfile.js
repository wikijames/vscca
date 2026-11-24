$( function () {
    $( '#table_id' ).on( 'click', '.profile-details', function () {
        sessionStorage.setItem( 'profileId', this.dataset.profileId );
        window.location = 'profile';
    } );
    loadProfileGrid();
} );

function loadProfileGrid () {
    const status = $( '#profileGridStatus' );
    const showLoadError = () => status.text( 'Could not load profiles. Refresh the page to try again.' );
    status.text( 'Loading profiles...' );

    $.ajax( {
        type: 'GET',
        url: getUsersProfileURL,
        dataType: 'json',
        headers: { Authorization: accessToken },
        success: function ( response ) {
            if ( response ) {
                checkSession( response.success );
            }
            if ( !response || response.success !== 200 || !Array.isArray( response.body ) ) {
                showLoadError();
                return;
            }

            const body = $( '#populateGrid' );
            response.body.forEach( profile => body.append( renderProfileRow( profile ) ) );
            initializeProfileGrid();
            status.text( '' );
        },
        error: showLoadError
    } );
}

function renderProfileRow ( profile ) {
    const row = document.createElement( 'tr' );
    row.insertCell().textContent = profile.firstName + ' ' + profile.lastName;
    row.insertCell().textContent = String( profile.accessType );
    row.insertCell().textContent = profile.isActive === 1 ? 'Active' : 'Deactive';

    const details = document.createElement( 'button' );
    details.type = 'button';
    details.className = 'btn pointer profile-details';
    details.dataset.profileId = String( profile.id );
    details.textContent = 'View/Edit';
    row.insertCell().append( details );
    return row;
}

function initializeProfileGrid () {
    $( '#table_id' ).DataTable( {
        language: { emptyTable: 'No profiles found.' },
        layout: { topStart: 'buttons', topEnd: 'search', bottomEnd: null },
        paging: false,
        buttons: [ {
            extend: 'excelHtml5',
            exportOptions: { format: { header: formatGridExportHeader } }
        } ],
        initComplete: function () {
            addGridColumnFilters( this.api(), [0, 1, 2] );
        }
    } );
}
