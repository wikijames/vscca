$(document).ready(function () {
    const sessionBillingId = sessionStorage.getItem('billingId');
    $('#isActive').change(function () {
        updateBillingActiveValue();
    });
    updateBillingActiveValue();

    if (sessionBillingId !== null) {
        loadBillingClient(sessionBillingId);
    }

    $('#save').click(function (event) {
        event.preventDefault();
        saveBillingClient(sessionBillingId !== null);
    });
});

function saveBillingClient(isEditing) {
    const id = isEditing ? $('#save').attr('title') : null;
    if (isEditing && !id) {
        alert('The billing client details are unavailable. Reopen the billing client before saving.');
        return;
    }


    const payload = {
        partyName: $('#partyName').val(),
        ledgerNo: $('#ledgerNumber').val(),
        pageNo: $('#pageNumber').val(),
        isActive: $('#isActive').val()
    };
    if (isEditing) {
        payload.id = id;
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

function updateBillingActiveValue() {
    const checkbox = $('#isActive');
    checkbox.val(checkbox.is(':checked') ? '1' : '0');
}

function loadBillingClient(id) {
    const failureMessage = 'Unable to load the billing client. Reopen it and try again.';
    $.ajax({
        method: 'GET',
        url: getBillingByIdURL,
        data: { id },
        dataType: 'json',
        headers: { Authorization: accessToken }
    }).done(function (response) {
        const client = response && response.body;
        if (Number(response && response.success) !== 200 || !client || !client.id || typeof client.client !== 'string') {
            alert(failureMessage);
            return;
        }

        const [partyName, ledgerNo, pageNo] = client.client.split('-');
        $('#billingId').val(client.id);
        $('#partyName').val(partyName);
        $('#ledgerNumber').val(ledgerNo);
        $('#pageNumber').val(pageNo);
        $('#isActive').prop('checked', Number(client.isActive) === 1);
        updateBillingActiveValue();
        $('#save').attr('title', client.id);

        if (sessionStorage.getItem('billingId') === id) {
            sessionStorage.removeItem('billingId');
        }
    }).fail(function () {
        alert(failureMessage);
    });
}
