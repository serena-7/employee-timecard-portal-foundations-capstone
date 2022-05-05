const newForm = document.querySelector('#new-time-form');
const jobcodeSelect = document.querySelector('#job-code-select-1');

const errCallback = err => console.log(err);

function getTimecards() {
    const userID = window.localStorage.getItem('userID');
    axios.get(`/timecards/${userID}`)
        .then(timecardsCallback)
        .catch(errCallback);
}

const timecardsCallback = (res) => {
    const timecards = res.data;
    displayTimecards(timecards);
}

function displayTimecards(timecards) {
    $('#past-table tbody').empty();
    for(let i = 0; i < timecards.length; i++){
        createRow(timecards[i]);
    }
}

function createRow(timecard) {
    const newRow = document.createElement('tr');
    const ID = timecard.timecard_id;
    for(key in timecard){
        if(key !== 'timecard_id'){
            if(key === 'date'){
                timecard[key] = convertDate(timecard[key], false);
            }
            const newCell = document.createElement('td');
            newCell.appendChild(document.createTextNode(timecard[key]));
            newCell.classList.add(key);
            newRow.appendChild(newCell);
        }
    }
    const newCell = newRow.insertCell();
    newCell.classList.add('buttons');
    const buttonContainer = document.createElement('div');
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerText = 'Edit';
    editBtn.onclick = () => editTimecard(ID,editBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('dlt-btn');
    deleteBtn.innerText = 'Delete';
    deleteBtn.onclick = () => deleteTimecard(ID,deleteBtn);
    buttonContainer.appendChild(editBtn);
    buttonContainer.appendChild(deleteBtn);

    newCell.appendChild(buttonContainer);
    newRow.appendChild(newCell);
    $('#past-table tbody').append(newRow);
}

function getJobcodes(inputID, value) {
    axios.get(`/jobcodes`)
        .then(res => jobcodesCallback(res,inputID, value))
        .catch(errCallback);
}

const jobcodesCallback = (res,inputID, value) => {
    const jobcodes = res.data;
    addJobcodes(jobcodes, inputID, value);
}

function addJobcodes(jobcodes, inputID, value) {
    $(`#${inputID}`).find('option').remove();
    for(let i = 0; i < jobcodes.length; i++){
        $(`#${inputID}`).append($("<option />").val(jobcodes[i].job_id).text(jobcodes[i].job_code));
    }
    if(value){
        $(`#${inputID} option:contains('${value}')`).attr('selected',true);
    }
}

function createTimecard(body) {
    axios.post(`/timecards`, body)
        .then(() => {console.log('timecard created')})
        .catch(errCallback);
}

function updateTimecard(timecardID) {
    let newDate = document.querySelector(`#date_${timecardID}`);
    let newJobCode = document.querySelector(`#job_code_${timecardID}`);
    let newHours = document.querySelector(`#hours_${timecardID}`);
    console.log(newHours.value);
    const bodyObj = {
        date: new Date(newDate.value).toISOString(),
        job_id: newJobCode.value,
        hours: newHours.value
    }

    axios.put(`/timecards/${timecardID}`, bodyObj)
        .then(() => {
            getTimecards();
            alert('timecard updated');
        })
        .catch(errCallback);
}

function editTimecard(id, item) {
    const row = item.parentNode.parentNode.parentNode
    var cells = row.children;
    for(let i = 0; i < cells.length; i++){
        if(cells[i].className === 'date'){
            cells[i].innerHTML = `<input type='datetime-local' id='${cells[i].className}_${id}' placeholder="${cells[i].innerText}">`;
            getTimecardDate(id);
        } else if (cells[i].className === 'job_code'){
            let oldJobcode = cells[i].innerText;
            cells[i].innerHTML = `<select id='${cells[i].className}_${id}' placeholder='${cells[i].innerText}'>`;
            const jobCode = document.querySelector(`#job_code_${id}`)
            getJobcodes(jobCode.id, oldJobcode);
        } else if (cells[i].className === 'hours'){
            cells[i].innerHTML = `<input type='number' id='${cells[i].className}_${id}' value='${cells[i].innerText}'>`;
        } else {
            const buttonDiv = cells[i].children[0];
            let button = buttonDiv.lastElementChild;
            while(button) {
                buttonDiv.removeChild(button);
                button = buttonDiv.lastElementChild;
            }
            const updateBtn = document.createElement('button');
            updateBtn.classList.add('update-btn');
            updateBtn.innerText = 'Update';
            updateBtn.onclick = () => updateTimecard(id);
            const cancelBtn = document.createElement('button');
            cancelBtn.classList.add('cancel-btn');
            cancelBtn.innerText = 'Cancel';
            cancelBtn.onclick = getTimecards;
            buttonDiv.appendChild(updateBtn);
            buttonDiv.appendChild(cancelBtn);
        }
    }
}

function deleteTimecard(id){
    axios.delete(`/timecards/${id}`)
        .then(getTimecards)
        .catch(errCallback)
}

function submitHandler(e) {
    e.preventDefault();
    let isInvalid = false;
    let bodyObjs = [];
    const userID = window.localStorage.getItem('userID');
    $('#new-time-tbody > tr').each(function(rowI, tr) {
        const object = {}
        $(this).find('td').each(function(dataI, td) {
            if(td.className !== 'buttons'){
                const input = td.children[0];
                console.log(input.value)
                if(input.value){
                    object[td.className] = input.value;
                } else {
                    isInvalid = true;
                }
            }
        })
        if(isInvalid) return;
        // let newDate = new Date(object.date);
        // console.log(newDate);
        const bodyObj = {
            userID,
            jobID: object.job_code,
            date: new Date(object.date).toISOString(),
            hours: object.hours
        }
        bodyObjs.push(bodyObj);
    })

    if(!isInvalid) {
        bodyObjs.forEach((bodyObj) => {
            createTimecard(bodyObj);
        })
        alert(`Created Timecards:`);
        // clearNewTable();
        getTimecards();
    } else {
        alert(`Invalid Inputs`)
    }
}

function getTimecardDate(timecardID){
    axios.get(`/timecarddate/${timecardID}`)
        .then((res) => {
            oldDate = convertDate(res.data.date, true);
            document.querySelector(`#date_${timecardID}`).value = oldDate;
        }).catch(errCallback);
}

newForm.addEventListener('submit', submitHandler);

loadPortal();
getJobcodes(jobcodeSelect.id, null);
getTimecards();