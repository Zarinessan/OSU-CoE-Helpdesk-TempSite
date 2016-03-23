// Returns a date object with todays date in a normal display format

function getToday(){
  var today = new Date()
  var dd = today.getDate()
  var mm = today.getMonth()+1 //January is 0!
  var yyyy = today.getFullYear()

  if(dd<10) {
    dd='0'+dd
  } 

  if(mm<10) {
    mm='0'+mm
  } 

  today = mm+'/'+dd+'/'+yyyy
  return today
}


// Finds the shift on the Current Temps sheet and accepts the shift for the 
//  person currently logged in.
//
// Parameters: 
// shiftStart - used to match column D
// shiftEnd - used to match column E
// shiftType - used to match column C

// Result:
// If the shift is found and not taken already
//  then column F is set to "yes"
//  column G is set to current user
function getShift(shiftStart, shiftEnd, shiftType){
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0")
  var lastRow = sheet.getLastRow()
  Logger.log("Last row = %s", lastRow)
  var range = sheet.getRange("A:G")
  
  for(y = 0; y < sheet.getLastRow(); y++){
    var cell = range.getCell(y+1, 4)
    Logger.log("y = %s     value = %s", y, cell.getValue())
    if(new Date(cell.getValue()).valueOf() == new Date(shiftStart).valueOf()){
      if(range.getCell(y+1, 6).getValue() != "yes"){
        Logger.log("Date was found!")
        cell = range.getCell(y+1, 6)
        cell.setValue("yes")
        cell = range.getCell(y+1, 7)
        cell.setValue(getUserName())
        break
      }
    }
    else{
      Logger.log("%s != %s", cell.getValue(), shiftStart)
    }
  }
  lock.releaseLock();
}

// Adds shift matching parameters to Current Temps spreadsheet
//
// Parameters: 
// shiftStart - used to fill column D
// shiftEnd - used to fill column E
// shiftType - used to fill column C

function tempShift(shiftStart, shiftEnd, shiftType) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0")
  var lastRow = sheet.getLastRow()
  var range = sheet.getRange("A:G")
  
  var cell = range.getCell(lastRow + 1, 1)
  cell.setValue(getUserName())
  
  var cell = range.getCell(lastRow + 1, 2)
  cell.setValue(getToday())
  
  var cell = range.getCell(lastRow + 1, 3)
  cell.setValue(shiftType)
  
  var cell = range.getCell(lastRow + 1, 4)
  cell.setValue(shiftStart)
  
  var cell = range.getCell(lastRow + 1, 5)
  cell.setValue(shiftEnd)
  lock.releaseLock();
}

// Unused function that finds the number of events for a date.
// Might be useful in the future
function getNumberOfEventsforHour(){
  var calendarName = 'HelpDesk';
  var date = new Date('September 28, 2015 03:00:00 AM PST');
  var twentyFourHours = new Date(date.getTime() + (24 * 60 * 60 * 1000));
  var events = CalendarApp.getCalendarsByName(calendarName);
  events[0].getEvents(date, twentyFourHours);
  
  Logger.log('Number of events: ' + events[0].length())
  
  return events[0].length;  
}


// Inprogress function that would include temps in users calendar.
// Currently unused. Might be useful in the future
function includeTemps(){
  var userName = getUserName()
  var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0")
  var range = sheet.getRange("A1:G"+sheet.getLastRow())
  var calendarName
  Logger.log("last row = %s", sheet.getLastRow())
  for(i = 1; i < sheet.getLastRow(); i++){
    if(range.getCell(i, 7).getValue() == userName){
      var tempName = range.getCell(i,2).getValue()
      if(tempName == "helpdesk"){
        calendarName = "HelpDesk"
      }
      else{
        calendarName = "LabStaff"
      }
      var calendars = CalendarApp.getCalendarsByName(calendarName)
      var ourCalendar = calendars[0]
      var event = ourCalendar.createEvent('Chosen Temp',
         new Date(range.getCell(i, 4).getValue()),
         new Date(range.getCell(i, 5).getValue()));
     }
  }
  
}


function tempShiftFromArray(string){
   
       var str = string
       var res = str.split(",")
       var currentDate = new Date(res[0])
       var difference =  0
       //For the closing shift 
       if(res[2] == 2){
         difference = 3
       }
       else{
         difference = res[2] - res[1]
       }
       var typeOfShift = res[4]
       Logger.log(difference)
       Logger.log(typeOfShift)
       var startTimeEpoch = currentDate.valueOf()
       Logger.log(startTimeEpoch)
       Logger.log(currentDate)
       var differenceEpoch = 1000 * 60 * 60 * difference + startTimeEpoch
       var endTime = new Date(differenceEpoch) 
       Logger.log(endTime)
       tempShift(currentDate, endTime, typeOfShift) 
 


  return true 
} 

function takeShiftFromArray(string){
    //var array = new Array()
    //array = ["Thu Sep 24 2015 14:00:00 GMT-0700 (PDT),13,14,whd,helpdesk"]
    var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0");
    var lastRow = sheet.getLastRow()
    var range = sheet.getRange("A:G")
    
    
    //for(var i = 0; i < array.length; i++){
       var str = string
       var res = str.split(",")
       var currentDate = new Date(res[0])
       var difference =  0
       //For the closing shift 
       if(res[2] == 2){
         difference = 3
       }
       else{
         difference = res[2] - res[1]
       }
       var typeOfShift = res[4]
       Logger.log(difference)
       Logger.log(typeOfShift)
       var startTimeEpoch = currentDate.valueOf()
       Logger.log(startTimeEpoch)
       Logger.log(currentDate)
       var differenceEpoch = 1000 * 60 * 60 * difference + startTimeEpoch
       var endTime = new Date(differenceEpoch ) 
       Logger.log(endTime)
       getShift(currentDate, endTime, typeOfShift) 
      


  return true 
} 


