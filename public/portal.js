const newForm = document.querySelector('#new-time-form');
const pastTable = document.querySelector("#past-table");
const tableBody = document.querySelector('#past-table>tbody')

const baseURL = `http://localhost:4005/api`;

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
    axios.get(`${baseURL}/timecards`,{params: {ID:userID}}).then(timecardsCallback).catch(errCallback);
}

function getJobcodes() {
    axios.get(`${baseURL}/jobcodes`).then(jobcodesCallback).catch(errCallback);
}

function addJobcodes(jobcodes) {
    $('#job-code-select').find('option').remove();
    for(let i = 0; i < jobcodes.length; i++){
        $('#job-code-select').append($("<option />").val(jobcodes[i].job_id).text(jobcodes[i].job_code));
    }
}

// function createTimecard(body) {
//     axios.post(`${baseURL}/timecards`,body).then(timecardsCallback).catch(errCallback);
// }

function createRow(timecard) {
    const newRow = document.createElement('tr');
    for(key in timecard){
        const newCell = document.createElement('td');
        newCell.appendChild(document.createTextNode(timecard[key]));
        newRow.appendChild(newCell);
    }
    const newCell = newRow.insertCell();
    const buttonContainer = document.createElement('div');
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn');
    editBtn.innerText = 'Edit';
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('dlt-btn');
    deleteBtn.innerText = 'Delete';
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

// function submitHandler(e) {
//     e.preventDefault();

//     const userID = window.localStorage.getItem('userID');
//     const date = document.querySelector('#date-input').value;
//     const jobCode = document.querySelector('#job-code-select').value;
//     const hours = document.querySelector('#hours-input').value;
// }

// newForm.addEventListener('submit', submitHandler);

getJobcodes();
getTimecards();