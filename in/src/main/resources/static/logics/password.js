$(document).ready(function () {
    const isAdmin = String(userRole).toLowerCase() === 'admin';
    if (isAdmin) {
        loadPasswordResetUsers();
    }

    $('#changePasswordForm').on('submit', function (event) {
        event.preventDefault();
        const password = $('#password').val();
        if (!password || password !== $('#confirmPassword').val()) {
            alert('Enter matching passwords.');
            return;
        }

        const payload = { password };
        if (isAdmin) {
            payload.userName = $('#userNames').val();
            if (!payload.userName) {
                alert('Select a user before resetting their password.');
                return;
            }
        }

        savePassword(isAdmin, payload);
    });
});

function loadPasswordResetUsers() {
    $.ajax({
        method: 'GET',
        url: getUsersURL,
        dataType: 'json',
        headers: { Authorization: accessToken }
    }).done(function (response) {
        if (!response || !Array.isArray(response.body)) {
            showPasswordFailure(Number(response && response.success), 'Unable to load users.');
            return;
        }

        const userNames = document.getElementById('userNames');
        response.body.forEach(function (user) {
            const option = document.createElement('option');
            option.value = user.emailId;
            option.textContent = user.firstName + ' ' + user.lastName;
            userNames.append(option);
        });
    }).fail(function (request) {
        showPasswordFailure(request.status, 'Unable to load users.');
    });
}

function savePassword(isAdmin, payload) {
    const saveButton = $('#save');
    saveButton.prop('disabled', true);

    $.ajax({
        url: isAdmin ? PostPasswordChangeURL : postPasswordChangeSelfURL,
        method: 'POST',
        contentType: 'application/json',
        headers: { Authorization: accessToken },
        data: JSON.stringify(payload)
    }).done(function (response) {
        const status = Number(response && response.success);
        if (status !== 200) {
            showPasswordFailure(status, 'Unable to update the password.');
            return;
        }

        $('#changePasswordForm')[0].reset();
        alert('Password updated successfully.');
        window.location = isAdmin ? 'adminPanel' : 'dashboard';
    }).fail(function (request) {
        showPasswordFailure(request.status, 'Unable to update the password.');
    }).always(function () {
        saveButton.prop('disabled', false);
    });
}

function showPasswordFailure(status, message) {
    if (status === 401) {
        sessionStorage.clear();
        alert('Your session is no longer authorized. Sign in again to continue.');
        return;
    }

    alert(message);
}
