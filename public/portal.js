const newForm = document.querySelector('#new-time-form');
const pastTable = document.querySelector("#past-table");
const tableBody = document.querySelector('#past-table>tbody');

const errCallback = err => console.log(err);

const timecardsCallback = (res) => {
    const timecards = res.data;
    console.log(timecards)
    displayTimecards(timecards);
}

const jobcodesCallback = (res) => {
    const jobcodes = res.data;
    console.log(jobcodes);
    addJobcodes(jobcodes);
}

function getTimecards() {
    const userID = window.localStorage.getItem('userID');
    console.log(userID);
    axios.get(`/timecards/${userID}`)
        .then(timecardsCallback)
        .catch(errCallback);
}

function getJobcodes() {
    axios.get(`/jobcodes`)
        .then(jobcodesCallback)
        .catch(errCallback);
}

function createTimecard(body) {
    axios.post(`/timecards`, body)
        .then(getTimecards)
        .catch(errCallback);
}

function updateTimecard(timecodeID) {
    let newDate = document.querySelector(`#date_${timecodeID}`);
    let newJobCode = document.querySelector(`#job_code_${timecodeID}`);
    let newHours = document.querySelector(`#hours_${timecodeID}`);

    const bodyObj = {
        date: newDate.value,
        job_id: newJobCode.value,
        hours: newHours.value
    }

    axios.put(`/timecards/${timecodeID}`, body)
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
            let oldDate = cells[i].innerText;
            cells[i].innerHTML = `<input type='date' id='${cells[i].className}_${id}' placeholder="${cells[i].innerText}">`;
            document.querySelector(`#date_${id}`).value = oldDate;
        } else if (cells[i].className === 'job_code'){
            cells[i].innerHTML = `<input type='select' id='${cells[i].className}_${id}' placeholder='${cells[i].innerText}'>`;
        } else if (cells[i].className === 'hours'){
            cells[i].innerHTML = `<input type='number' id='${cells[i].className}_${id}' placeholder='${cells[i].innerText}'>`;
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

function addJobcodes(jobcodes) {
    $('#job-code-select').find('option').remove();
    for(let i = 0; i < jobcodes.length; i++){
        $('#job-code-select').append($("<option />").val(jobcodes[i].job_id).text(jobcodes[i].job_code));
    }
}


function createRow(timecard) {
    const newRow = document.createElement('tr');
    const ID = timecard.timecard_id;
    for(key in timecard){
        if(key !== 'timecard_id'){
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

function displayTimecards(timecards) {
    $('#past-table tbody').empty();
    for(let i = 0; i < timecards.length; i++){
        createRow(timecards[i]);
    }
}

function submitHandler(e) {
    e.preventDefault();

    const userID = window.localStorage.getItem('userID');
    const jobCode = document.querySelector('#job-code-select');
    const dateInput = document.querySelector('#date-input');
    const hours = document.querySelector('#hours-input');

    const bodyObj = {
        userID,
        jobID: jobCode.value,
        date: dateInput.value,
        hours: hours.value
    }

    createTimecard(bodyObj);

    getCurrDate();
    hours.value = '';
}

newForm.addEventListener('submit', submitHandler);

loadPortal();
getJobcodes();
getTimecards();