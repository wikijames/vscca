function loadListGrid ( { url, statusSelector, label, renderRow, initialize } ) {
    const status = $( statusSelector );
    const showLoadError = () => status.text( 'Could not load ' + label + '. Refresh the page to try again.' );
    status.text( 'Loading ' + label + '...' );

    $.ajax( {
        type: 'GET',
        url,
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
            response.body.forEach( entry => body.append( renderRow( entry ) ) );
            initialize();
            status.text( '' );
        },
        error: showLoadError
    } );
}
