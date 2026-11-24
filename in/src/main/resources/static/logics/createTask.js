$(document).ready(function(){
    const sessionTaskId = sessionStorage.getItem('taskId');
    if (sessionTaskId != null) {
        $('#fileinfo').hide();
    }

    $('.billingClientNameClass').select2({});
    const userLabel = user => user.firstName + ' ' + user.lastName;
    const dropdowns = [
        ['.billingClientNameClass', getBillingClientsURL, 'client'],
        ['#taskType', getTasksURL, 'task'],
        ['#responsibility', getResponsiblityUsersURL, 'emailId', userLabel],
        ['#execution', getExecutionUsersURL, 'emailId', userLabel],
        ['#consulting', getConsultingUsersURL, 'emailId', userLabel],
        ['#intimation', getIntimationUsersURL, 'emailId', userLabel]
    ];
    let pendingOptions = dropdowns.length;
    let optionsFailed = false;

    function onOptionsLoaded() {
        pendingOptions -= 1;
        if (pendingOptions === 0 && !optionsFailed && sessionTaskId !== null) {
            getViewTaskById();
        }
    }

    function onOptionsFailed() {
        if (!optionsFailed) {
            optionsFailed = true;
            alert('Unable to load task options. Reopen the form and try again.');
        }
    }

    dropdowns.forEach(function ([selector, url, valueField, formatLabel]) {
        $.ajax({
            type: 'GET',
            url,
            dataType: 'json',
            headers: { Authorization: accessToken },
            success: function (response) {
                if (!response || !Array.isArray(response.body)) {
                    onOptionsFailed();
                    return;
                }
                response.body.forEach(function (record) {
                    if (record && record[valueField] != null) {
                        const value = record[valueField];
                        appendTaskOption(selector, value, formatLabel ? formatLabel(record) : value);
                    }
                });
                onOptionsLoaded();
            },
            error: onOptionsFailed
        });
    });

    let dueDate;
    $('#endDate').change(function () {
        dueDate = $(this).val();
    });

    $('#save').click(function (event) {
        event.preventDefault();
        const taskId = $('#save').attr('title');
        if (sessionTaskId != null && !taskId) {
            alert('Task details are unavailable. Reopen the task before saving.');
            return;
        }
        saveTask(Boolean(taskId), dueDate);
    });
});

function appendTaskOption(selector, value, label) {
    $(selector).each(function () {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        this.appendChild(option);
    });
}

function saveTask(isEditing, dueDate) {
    const payload = {
        projectName: $('#projectName').val(),
        partyName: $('#partyName').val(),
        weightage: $('#weightage').val(),
        taskDescription: $('#description').val(),
        taskType: $('#taskType').val(),
        billingClient: $('#billingClientName').val(),
        dueDate,
        responsibility: $('#responsibility').val(),
        intimation: $('#intimation').val(),
        exceution: $('#execution').val(),
        consulting: $('#consulting').val()
    };
    if (isEditing) {
        payload.status = $('#status').val();
        payload.remarks = $('#remarks').val();
        payload.delayReason = $('#reasonForDelay').val();
        payload.taskId = $('#taskId').val();
    }

    function showSaveFailure(status) {
        if (status === 401) {
            sessionStorage.clear();
            alert('Your session is no longer authorized. Sign in again before saving.');
        } else if (status === 403) {
            alert('You do not have permission to save this task.');
        } else {
            alert('Unable to save the task.');
        }
    }

    $.ajax({
        url: isEditing ? postEditTaskURL : postCreateTaskURL,
        method: 'POST',
        contentType: 'application/json',
        headers: { Authorization: accessToken },
        data: JSON.stringify(payload)
    }).done(function (response) {
        const status = Number(response && response.success);
        if (status !== 200) {
            showSaveFailure(status);
            return;
        }

        $('#createForm')[0].reset();
        alert(isEditing ? 'Task updated successfully.' : 'Task created successfully.');
        window.location = 'dashboard';
    }).fail(function (request) {
        showSaveFailure(request.status);
    });
}
