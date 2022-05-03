function getCurrDate() {
    let dateField = document.querySelector('#date-input')
    let currentDateInfo = document.querySelector('#current-date-info')
    let date = new Date();
    let currDateFormat = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2,'0') + '-' + (date.getDate()).toString().padStart(2,'0');
    let currDateText = (date.getMonth() + 1).toString().padStart(2,'0') + ' / ' + (date.getDate()).toString().padStart(2,'0') + ' / ' + date.getFullYear();
    dateField.value = currDateFormat;
    currentDateInfo.innerText = currDateText;
}

function loadPortal() {
    let nameInfo = document.querySelector('#name-info');
    let firstName = window.localStorage.getItem('firstName');
    let lastName = window.localStorage.getItem('lastName');
    nameInfo.innerHTML = firstName + ' ' + lastName;
    getCurrDate();
}