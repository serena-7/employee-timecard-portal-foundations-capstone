var rowNum = 2;
var newTimecards = [];

function getCurrDate() {
    // let dateField = document.querySelector('#date-input-1')
    let currentDateInfo = document.querySelector('#current-date-info')
    // dateField.value = convertDate(null,true);
    currentDateInfo.innerText = convertDate(null, false);
}

function loadPortal() {
    let nameInfo = document.querySelector('#name-info');
    let firstName = window.localStorage.getItem('firstName');
    let lastName = window.localStorage.getItem('lastName');
    nameInfo.innerHTML = firstName + ' ' + lastName;
    getCurrDate();
}

function convertDate(dateText, toDateFormat){
    let date;
    if(dateText){
        date = new Date(dateText);
    } else {
        date = new Date();
    }
    if(toDateFormat){
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0');
    } else {
        return (date.getMonth() + 1).toString().padStart(2,'0') + ' / ' + (date.getDate()).toString().padStart(2,'0') + ' / ' + date.getFullYear();
    }
}

$("#add-row-btn").on('click', function(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    $('#new-time-tbody').append(`
    <tr id="row-${rowNum}">
        <td class="date">
            <input type="date" class="date-input">
        </td>
        <td class="job_code">
            <select class="job-code-select" id="job-code-select-${rowNum}"></select>
        </td>
        <td class="hours">
            <input type="number" class="hours-input" min="0" max="24"/>
        </td>
        <td class="buttons">
            <div class="btn-container">
                <button type="button" id="dlt-${rowNum}" class="delete-row-btn">X</button>
            </div>
        </td>
    </tr>
    `);
    getJobcodes(`job-code-select-${rowNum}`, null);
    rowNum++;
})

$(document).on('click','.delete-row-btn', function(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    $(this).parents('tr').first().remove();
})

// $(document).ready(function() {
//     let nameInfo = document.querySelector('#name-info');
//     let firstName = window.localStorage.getItem('firstName');
//     let lastName = window.localStorage.getItem('lastName');
//     nameInfo.innerHTML = firstName + ' ' + lastName;
//     getCurrDate();
//     $('.job_code')
// })