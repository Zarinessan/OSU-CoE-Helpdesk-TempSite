//Email address of the person running the script.
function getEmail() {
  return Session.getActiveUser().getEmail();
}

// Adds a calendar with name string to the current users calendars
function addCalendar(string){
  var cal = CalendarApp.createCalendar(string)
  Logger.log('Created calendar: %s',string)
}

// Takes a string and deletes all calendars whose name matches string
//              CASE NOT SENSITIVE
function removeCalendars(string){
  var calendars = CalendarApp.getCalendarsByName(string)
  
  for (var i = 0; i < calendars.length; i++){
    calendars[i].deleteCalendar()
  }
  Logger.log('Removed any calendars matching $s',string)
}


// Makes events on the calendar matching calendarName from today until endOfTerm
// 
// Parameters:
// calendarName - Name of the calendar we are adding to. Case matters!
// eventName - Typically the persons name. Ex: "helpdesk"
// startShift - Starting date and time of the shift (date object)
// endShift - Ending date and time of the shift (date object)
// endOfTerm - Date specified as the end of the term in the scheduling doc. (Ends 5pm)
function addRecurringEvent(calendarName, eventName, startShift, endShift, endOfTerm){ 
   //var calendarName = "Halpdesk"
   var calendars = CalendarApp.getCalendarsByName(calendarName)
   var ourCalendar = calendars[0]
   
   // Examples of date formatting
   //var startShift = new Date('January 1, 2015 03:00:00 PM EST')
   //var endShift = new Date('January 1, 2015 04:00:00 PM EST')
   //var endOfTerm = new Date('January 1, 2016')
   
   var recurrence = CalendarApp.newRecurrence().addWeeklyRule().until(endOfTerm)
   if(startShift.valueOf() < endOfTerm.valueOf()){
     var eventSeries = ourCalendar.createEventSeries(eventName, startShift, endShift, recurrence)
   }
}

// Removes Helpdesk and LabStaff calendars and readds them. 
function addBoth(){
  removeCalendars("HelpDesk")
  removeCalendars("LabStaff")
  addCalendar("HelpDesk")
  addCalendar("LabStaff")
}

// Calls getMySchedule which builds their schedules for the 2 calendars. 
function syncCalendar(){
  getMySchedule()
}

