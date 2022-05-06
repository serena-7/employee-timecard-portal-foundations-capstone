const newForm = document.querySelector('#new-time-form');

const errCallback = err => console.log(err);

function getJobcodes(selector, initVal) {
    axios.get(`/jobcodes`)
        .then((res) => jobcodesCallback(res,selector,initVal))
        .catch(errCallback);
}

const jobcodesCallback = (res,selector,initVal) => {
    const jobcodes = res.data;
    $(`${selector}`).find('option').remove();
    $(`${selector}`).append(`<option disabled selected value>--select--</option>`);
    for(let i = 0; i < jobcodes.length; i++){
        $(`${selector}`).append($("<option />").val(jobcodes[i].job_id).text(jobcodes[i].job_code));
    }
    if(initVal){
        console.log(initVal)
        $(`${selector} option:contains('${initVal}')`).attr('selected',true);
    }
}

function getTimecards() {
    const userID = window.localStorage.getItem('userID');
    axios.get(`/timecards/${userID}`)
        .then(timecardsCallback)
        .catch(errCallback);
}

const timecardsCallback = res => {
    const timecards = res.data;
    $('#past-table tbody').empty();
    for(let i = 0; i < timecards.length; i++){
        createRow(timecards[i]);
    }
}

function createRow(timecard) {
    const ID = timecard.timecard_id;
    let date = convertDate(timecard.start_timestamp,false);
    let startTime = extractTime(timecard.start_timestamp, true);
    let endTime = extractTime(timecard.end_timestamp, true);
    $('#past-table tbody').append(`
    <tr class="past-row" id="past-row-${ID}">
        <td class="date">${date}</td>
        <td class="start-time">
            <time datetime="${timecard.start_timestamp}">
                ${startTime}
            </time>
        </td>
        <td class="end-time">
            <time datetime="${timecard.end_timestamp}">
                ${endTime}
            </time>
        </td>
        <td class="hours">${timecard.hours}</td>
        <td class="job-code">${timecard.job_code}</td>
        <td class="buttons">
            <div class="btn-container">
                <button class="edit-btn">Edit</button>
                <button class="dlt-btn">Delete</button>
            </div>
        </td>
    </tr>
    `)
}

function editTimecard(ID){
    date = $(`#past-row-${ID} .date`).text();
    startTime = $(`#past-row-${ID} .start-time time`).attr('datetime');
    endTime = $(`#past-row-${ID} .end-time time`).attr('datetime');
    jobCode = $(`#past-row-${ID} .job-code`).text();
    
    $(`#past-row-${ID} .date`).html(`<input type="date" class="date-input">`);
    $(`#past-row-${ID} .date .date-input`).val(convertDate(startTime,true));
    $(`#past-row-${ID} .start-time`).html(`<input type="time" class="start-time-input">`);
    $(`#past-row-${ID} .start-time-input`).val(extractTime(startTime,false));
    $(`#past-row-${ID} .end-time`).html(`<input type="time" class="end-time-input">`);
    $(`#past-row-${ID} .end-time-input`).val(extractTime(endTime,false));
    $(`#past-row-${ID} .job-code`).html(`<select class="job-code-select"></select>`)
    getJobcodes(`#past-row-${ID} .job-code-select`,jobCode);
    $(`#past-row-${ID} .btn-container`).remove();
    $(`#past-row-${ID} .buttons`).html(`
        <div class="btn-container">
            <button class="update-btn">Update</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    `)
}

function updateTimecard(id){
    const newjobCode = $(`#past-row-${id} .job-code-select`).val();
    const newDate = $(`#past-row-${id} .date-input`).val();
    const newStart = $(`#past-row-${id} .start-time-input`).val();
    const newEnd = $(`#past-row-${id} .end-time-input`).val();
    const startTimestamp = new Date(newDate + 'T' + newStart + '-07:00').toISOString();
    const endTimestamp = new Date(newDate + 'T' + newEnd + '-07:00').toISOString();
    const newHours = $(`#past-row-${id} .hours`).text();
    const bodyObj = {
        job_id: +newjobCode,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
        hours: +newHours
    }
    console.log(bodyObj);
    axios.put(`/timecards/${id}`, bodyObj)
        .then(() => {
            getTimecards();
            alert('timecard updated');
        })
        .catch(errCallback);
}

function deleteTimecard(id){
    axios.delete(`/timecards/${id}`)
        .then(getTimecards)
        .catch(errCallback)
}

function createTimecard(body){
    axios.post(`/timecards`, body)
        .then(() => console.log('timecard created'))
        .catch(errCallback);
}

function submitHandler(e){
    e.preventDefault();
    const userID = window.localStorage.getItem('userID');
    $(`#new-time-tbody > tr`).each(function(rowInd, tr) {
        const object = {};
        $(this).find('td').each(function(dataInd, td) {
            if(td.className !== 'buttons'){
                if(td.className === 'hours'){
                    object[td.className] = td.innerHTML;
                } else {
                    const input = td.children[0];
                    object[td.className] = input.value;
                }
            }
        })
        object['startTimestamp'] = new Date(object['date'] + 'T' + object['start-time'] + '-07:00').toISOString();
        object['endTimestamp'] = new Date(object['date'] + 'T' + object['end-time'] + '-07:00').toISOString();
        
        const bodyObj = {
            userID,
            jobID: object['job-code'],
            startTimestamp: object['startTimestamp'],
            endTimestamp: object['endTimestamp'],
            hours: object['hours']
        }
        createTimecard(bodyObj);
    })
    alert('Created Timecards');
    getTimecards();
}

newForm.addEventListener('submit', submitHandler);

getTimecards();
getJobcodes(`#row-1 .job-code-select`,null);