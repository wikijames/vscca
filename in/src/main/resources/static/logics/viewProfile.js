$( function () {
    $( '#table_id' ).on( 'click', '.profile-details', function () {
        sessionStorage.setItem( 'profileId', this.dataset.profileId );
        window.location = 'profile';
    } );
    loadListGrid( {
        url: getUsersProfileURL,
        statusSelector: '#profileGridStatus',
        label: 'profiles',
        renderRow: renderProfileRow,
        initialize: initializeProfileGrid
    } );
} );

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
