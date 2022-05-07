const newForm = document.querySelector('#new-time-form');

const errCallback = err => console.log(err);

//function to get jobcodes from database
function getJobcodes(selector, initVal) {
    axios.get(`/jobcodes`)
        .then((res) => jobcodesCallback(res,selector,initVal))
        .catch(errCallback);
}

//adds the response of jobcodes to the jobcode selector
const jobcodesCallback = (res,selector,initVal) => {
    const jobcodes = res.data;
    $(`${selector}`).find('option').remove();
    //adds a default option that is null
    $(`${selector}`).append(`<option disabled selected value>--select--</option>`);
    //loops through jobcodes and adds them to drop down
    for(let i = 0; i < jobcodes.length; i++){
        $(`${selector}`).append($("<option />").val(jobcodes[i].job_id).text(jobcodes[i].job_code));
    }
    //initVal will be set if it is not null
    if(initVal){
        console.log(initVal)
        $(`${selector} option:contains('${initVal}')`).attr('selected',true);
    }
}

//gets all timecards for the user that logged in
function getTimecards() {
    const userID = window.localStorage.getItem('userID');
    axios.get(`/timecards/${userID}`)
        .then(timecardsCallback)
        .catch(errCallback);
}

//creates table os past timecards from database response
const timecardsCallback = res => {
    const timecards = res.data;
    //clear old tbody
    $('#past-table tbody').empty();
    for(let i = 0; i < timecards.length; i++){
        createRow(timecards[i]);
    }
}

//creates each row for table
function createRow(timecard) {
    const ID = timecard.timecard_id;
    let date = convertDate(timecard.start_timestamp,false);
    let startTime = extractTime(timecard.start_timestamp, true);
    let endTime = extractTime(timecard.end_timestamp, true);
    //append tbody to contain the new row html
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

//makes row editable when edit button is clicked
function editTimecard(ID){
    //get old values
    date = $(`#past-row-${ID} .date`).text();
    startTime = $(`#past-row-${ID} .start-time time`).attr('datetime');
    endTime = $(`#past-row-${ID} .end-time time`).attr('datetime');
    jobCode = $(`#past-row-${ID} .job-code`).text();
    
    //change each td to an input and make value the old value
    $(`#past-row-${ID} .date`).html(`<input type="date" class="date-input">`);
    $(`#past-row-${ID} .date .date-input`).val(convertDate(startTime,true));
    $(`#past-row-${ID} .start-time`).html(`<input type="time" class="start-time-input">`);
    $(`#past-row-${ID} .start-time-input`).val(extractTime(startTime,false));
    $(`#past-row-${ID} .end-time`).html(`<input type="time" class="end-time-input">`);
    $(`#past-row-${ID} .end-time-input`).val(extractTime(endTime,false));
    $(`#past-row-${ID} .job-code`).html(`<select class="job-code-select"></select>`)
    getJobcodes(`#past-row-${ID} .job-code-select`,jobCode);
    //change options to be update and cancel
    $(`#past-row-${ID} .btn-container`).remove();
    $(`#past-row-${ID} .buttons`).html(`
        <div class="btn-container">
            <button class="update-btn">Update</button>
            <button class="cancel-btn">Cancel</button>
        </div>
    `)
}

//update timecard in database when update button clicked
function updateTimecard(id){
    //collect data to be sent and put in a body object
    const newjobCode = $(`#past-row-${id} .job-code-select`).val();
    const newDate = $(`#past-row-${id} .date-input`).val();
    const newStart = $(`#past-row-${id} .start-time-input`).val();
    const newEnd = $(`#past-row-${id} .end-time-input`).val();
    const startTimestamp = new Date(newDate + 'T' + newStart + '-06:00').toISOString();
    const endTimestamp = new Date(newDate + 'T' + newEnd + '-06:00').toISOString();
    const newHours = $(`#past-row-${id} .hours`).text();
    const bodyObj = {
        job_id: +newjobCode,
        start_timestamp: startTimestamp,
        end_timestamp: endTimestamp,
        hours: +newHours
    }
    //send bodyObj and timecard id to update the database
    axios.put(`/timecards/${id}`, bodyObj)
        .then(() => {
            getTimecards(); //reload timecards
            alert('timecard updated');
        })
        .catch(errCallback);
}

//send timecard id to delete timecard in the database
function deleteTimecard(id){
    axios.delete(`/timecards/${id}`)
        .then(getTimecards)
        .catch(errCallback)
}

//send body to create new timecard in the database
function createTimecard(body){
    axios.post(`/timecards`, body)
        .then(() => console.log('timecard created'))
        .catch(errCallback);
}

//clears new timecard entries after submit
function clearEntryForm() {
    $(`#new-time-tbody`).empty();
    addNewRow();
}

//callback for submitting new entry form
function submitHandler(e){
    e.preventDefault();
    const userID = window.localStorage.getItem('userID');
    //loop through each row of table and create object to send
    $(`#new-time-tbody > tr`).each(function(rowInd, tr) {
        const object = {};
        //loop through each cell in row and compile object
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
        //create new timestamp elements with data in cells
        object['startTimestamp'] = new Date(object['date'] + 'T' + object['start-time'] + '-06:00').toISOString();
        object['endTimestamp'] = new Date(object['date'] + 'T' + object['end-time'] + '-06:00').toISOString();
        
        //create body to send
        const bodyObj = {
            userID,
            jobID: object['job-code'],
            startTimestamp: object['startTimestamp'],
            endTimestamp: object['endTimestamp'],
            hours: object['hours']
        }
        // console.log(bodyObj);
        createTimecard(bodyObj);
    })
    alert('Created Timecards');
    clearEntryForm(); //clear form
    getTimecards(); //reload timecards
}

//new timecard entry submit event
newForm.addEventListener('submit', submitHandler);

getTimecards(); //load timecards from database
getJobcodes(`#row-1 .job-code-select`,null); //load jobcodes on first row