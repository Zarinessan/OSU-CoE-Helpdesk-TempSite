
function sortTemps(){
  var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0")
  if(sheet.getLastRow() != 1){
    var range = sheet.getRange("A2:G"+sheet.getLastRow())
    range.sort(4)
  }  
}



function createStringTemps(){
  var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0")
  var range = sheet.getRange("A:G")
  var shiftString = ""
  
  for(y = 1; y < sheet.getLastRow(); y++){
    if(range.getCell(y+1,6).getValue() != "yes"){
      var tempString = range.getCell(y+1, 1).getValue() + " needs a temp for " + range.getCell(y+1, 3).getValue()
                       + " on " + new Date(range.getCell(y+1, 4).getValue()).toDateString() + " from " 
                       + new Date(range.getCell(y+1, 4).getValue()).toLocaleTimeString() + " to " 
                       + new Date(range.getCell(y+1, 5).getValue()).toLocaleTimeString() + "\n \n"
      Logger.log("tempString = %s", tempString)
      shiftString = shiftString + tempString
    }   
  }
  return shiftString    
}


function sendTempEmailLabs() {
  var tempString = createStringTemps()
  if(tempString != ""){
      MailApp.sendEmail("lab-staff@engr.orst.edu",
                   "Available Temp Shifts",
                   tempString);
  }
}

function sendTempEmailDesk() {
  var tempString = createStringTemps()
  if(tempString != ""){
      MailApp.sendEmail("helpdesk-staff@engr.orst.edu",
                   "Available Temp Shifts",
                   tempString);
  }
}



function deleteTrigger() {
  // Loop over all triggers.
  var allTriggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < allTriggers.length; i++) {
    // delete it.
      ScriptApp.deleteTrigger(allTriggers[i]);
  }
}


function createTimeDrivenTriggers() {
  // Trigger every 24 hours.
  ScriptApp.newTrigger('sendTempEmail')
      .timeBased()
      .everyHours(10)
      .create()
      
  ScriptApp.newTrigger('oldTemps')
      .timeBased()
      .everyHours(24)
      .create()
//      
// // Trigger every Monday at 03:00.
//  ScriptApp.newTrigger('deleteOldHD')
//      .timeBased()
//      .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
//      .atHour(15)
//      .create();
//
//// Trigger every Monday at 03:00.
//  ScriptApp.newTrigger('deleteOldLS')
//      .timeBased()
//      .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
//      .atHour(16)
//      .create();
//
// // Trigger every Saturday at 03:00.
//   ScriptApp.newTrigger('deskSchedule')
//      .timeBased()
//      .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
//      .atHour(17)
//      .create();
//
//
//
//// Trigger every Saturday at 03:00.
//   ScriptApp.newTrigger('labSchedule')
//      .timeBased()
//      .onWeekDay(ScriptApp.WeekDay.WEDNESDAY)
//      .atHour(18)
//      .create();
//      
  
}