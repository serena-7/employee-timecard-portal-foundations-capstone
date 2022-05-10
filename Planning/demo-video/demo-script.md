## Introduction:

---

- This is my first solo full stack application at Devmountain. I decided to create an employee timecard portal where employees can view, edit, and create timecards.
- The application is run with node.js.
- The front end was built using HTML, CSS, Javascript, axios.js, and jquery.js.
- The back end was built and runs with express.js and sequelize.js
- The database is postgreSQL hosted on heroku. Note that the passwords in the user table are encrypted and tested using the extension pgcrypto directly in the database.
- The application can be run using dotenv or the hosted Heroku site.

## Login Page:

---

- This first page is the employee login page where users can either register a new account or login to their existing account.

### Registering a User:

- First we will register a new user using the Register User form.
- All fields are required so after you fill them all in click REGISTER.
  - ACTION: fill in Sally Burke information and click REGISTER.
- The javascript will check if the email already exists in the users database and check that the password and confirm password match before creating the new user.
- Upon successful registration it will automatically log the user in to the timecard portal.
- This is what the portal looks like as you can see there are no past timecards because the user is new. We'll come back to this page in a minute but first lets logout by clicking the LOGOUT button.
  - ACTION: click logout.

### Logging in a User:

- Enter the email and password for a user in this case we'll use bob's account.
  - ACTION: enter bob@email.com and bob's password
- Click LOGIN.
- The javascript will save the user's information that is pulled from the database in local storage before moving on to the employee portal so it can be accessed.

## Employee Portal Page:

---

- this is what the employee's portal page will look like once logged in.

### Info Section:

- The info section loads with the user's name, the current date, and the timezone on the user's local machine for reference.
- The timezone is important because the times the user enters and sees displayed are in the local timezone but the database stores these in UTC.

### Past Timecards Section Quick Look:

- Now unlike when we registered Sally Bob's account already existed with timecards so the past timecards table filled in withh all of Bob's timecards in the database. We'll come back to this section in a bit.

### New Timecard Entry Section:

- The new timecard entry section allows the user to enter in new timecards.
- Enter the date using the date picker:
  - ACTION: Enter May 3, 2022
- Next select the start time and end time using the time pickers.
  - ACTION: Select 7:00 AM and 2:00 PM
- Notice that when the time is changed in either time input a function is run that updated the total hours automatically if both time fields are filled in. Notice when i change the end time from 2 PM to 3PM the hours updates from 7 to 8.
  - ACTION: change end time to 3:00 PM
- Next select the jobcode for that timecard from the drop down menu. Available jobcodes are automatically pulled from the database.
  - ACTION: change jobcode to jobsite2
- If you want to enter more than one timecard at a time you can click the add row button as many times as you wish.
  - ACTION: click add row twice.
- if you want to then delete a row simply click the X button on that row.
  - ACTION: click x on middle row.
- let's fill in a second row:
  - ACTION: fill in May 4 2022, 7:00AM to 1:OOPM jobsite3
- Now after all inputs are filled out click submit.
  - ACTION: click submit
- If adding timecards is successful you'll get a message alert saying created timecards.
- As you can see the past timecards table has now been updated with the new timecards. The most recent timecards are at the top.

### Past Timecards Section: Again

- Each timecard in the table has some options. First let's say I got the time and jobcode wrong for the newest timecard. I can click the edit button.
  - ACTION: click edit on newest timecard (May 4)
- Each field that can be edited will change to input boxes.
- The option buttons for that timecard have now changed to update and cancel. if you change your mind about editing the timecard just click cancel and it will return to normal.
  - ACTION: click cancel button
- Or after clicking edit update the fields you want to change. So in this case we are changing the end time to 3PM which will automatically update the hours to 8 hrs for us.
  - ACTION: change end time to 3 PM
- And we are changing the jobscode to be jobsite2
  - ACTION: change jobcode to jobsite2
- Now click update and if it updates correctly we'll get a message alert "timecard updated" then the past timecards will be updated to fit the new info in the database.
  - ACTION: click update.
- You can also delete a timecard by clicking delete.
  - ACTION: click delete on top timecard (May 4).
- A confirm alert will pop up asking if you want to delete timecard for the date of the timecard you selected in this case it's for May 4 2022. Click OK to continue deleting.
- If deleted from database an alert will pop up saying timecard deleted and after clicking okay the past timecard table will update without that timecard.

## Conclusion:

---

- so that sums up my projects capabilities.
- I had a blast finding new methods for creating this application. jquery is my new favorite thing for editing html in javascript which is how all the table editing was made possible. and using the pgcrypto extension in SQL made for slick password encryption.
