var rowNum = 2;

function getCurrDate() {
    let currentDateInfo = document.querySelector('#current-date-info')
    currentDateInfo.innerText = convertDate(null, false);
}

function convertDate(dateText, toDateFormat){
    let date;
    if(dateText){
        date = new Date(dateText);
    } else {
        date = new Date();
    }
    if(toDateFormat){
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')
    } else {
        return (date.getMonth() + 1).toString().padStart(2,'0') + '/' + (date.getDate()).toString().padStart(2,'0') + '/' + date.getFullYear()
    }
}

function extractTime(dateText, isAMPM){
    let date = new Date(dateText);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if(isAMPM){
        const suffix = hours >= 12 ? 'PM' : 'AM';
    
        hours = ((hours + 11) % 12 + 1);
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')} ${suffix}`;
    } else {
        return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`
    }
}

function calcHours(start,end) {
    start = start.split(':');
    end = end.split(':');
    let tempStart = new Date(0, 0, 0, start[0], start[1], 0);
    let tempEnd = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = tempEnd.getTime() - tempStart.getTime();
    var hours = diff / 1000 / 60 / 60;
    return hours;
}

function updateTotHours(rowID){
    let start = $(`#${rowID} .start-time-input`).val();
    let end = $(`#${rowID} .end-time-input`).val();
    if(start && end){
        totHours = calcHours(start,end);
        $(`#${rowID} .hours`).html(`${totHours}`);
    }
}

function addNewRow(){
    $('#new-time-tbody').append(`
    <tr id="row-${rowNum}">
        <td class="date">
            <input type="date" class="date-input" required>
        </td>
        <td class="start-time">
            <input type="time" class="start-time-input" required>
        </td>
        <td class="end-time">
            <input type="time" class="end-time-input" required>
        </td>
        <td class="hours">
            <p>0</p>
        </td>
        <td class="job-code">
            <select class="job-code-select" required></select>
        </td>
        <td class="buttons">
            <div class="btn-container">
                <button type="button" class="delete-row-btn">X</button>
            </div>
        </td>
    </tr>
    `);
    getJobcodes(`#row-${rowNum} .job-code-select`,null);
    rowNum++;
}

$("#add-row-btn").on('click', function(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    addNewRow();
})

$(document).on('click','.delete-row-btn', function(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    $(this).parents('tr').first().remove();
})

$(document).on('click','.dlt-btn', function(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    let timecardID = $(this).closest('tr').attr('id').match(/(\d+)/)[0];
    let timecardDate = $(`#past-row-${timecardID} .date`).text();
    let result = confirm(`Want to delete timecard for ${timecardDate}?`);
    if(result){
        deleteTimecard(timecardID)
        alert('timecard deleted')
    }
})

$(document).on('click','.edit-btn', function(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    let timecardID = $(this).closest('tr').attr('id').match(/(\d+)/)[0];
    editTimecard(timecardID);
})

$(document).on('change','.start-time-input', function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    let rowID = $(this).closest('tr').attr('id')
    updateTotHours(rowID);
})

$(document).on('change','.end-time-input', function(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    let rowID = $(this).closest('tr').attr('id')
    updateTotHours(rowID);
})

$(document).on('click','.update-btn', function(event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    let timecardID = $(this).closest('tr').attr('id').match(/(\d+)/)[0];
    updateTimecard(timecardID);
})

$(document).on('click','.cancel-btn', function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    getTimecards();
})

$(document).ready(function() {
    let nameInfo = document.querySelector('#name-info');
    let firstName = window.localStorage.getItem('firstName');
    let lastName = window.localStorage.getItem('lastName');
    nameInfo.innerHTML = firstName + ' ' + lastName;
    getCurrDate();
})