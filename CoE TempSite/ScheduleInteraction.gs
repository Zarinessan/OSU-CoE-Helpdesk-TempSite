

// Sets startShift and endShift given values from the scheduling spreadsheet
//     Calls addRecurringEvent
//
// Parameters: Keep in mind these are all gathered from the scheduling document in real time
// calendarName - Typically the type of shift "Helpdesk"
// eventName - calendarName + " Shift"
// time1 - Time corresponding with the found name on the spreadsheet (column A)
// date1 - Date object taken from the spreadsheet (row 4) 
function createShift(calendarName, eventName, time1, date1, time2, date2, endDate){
    
    var startShift = new Date(date1.setHours(time1.getHours()))
    var endShift = new Date(date2.setHours(time2.getHours()))
    Logger.log("startShift = %s, endShift = %s", startShift, endShift)
    
    addRecurringEvent(calendarName, eventName, startShift, endShift, endDate)
}

// Given a userName ("Patrick") this finds all of the locations on the scheduling sheet
//  where "Patrick" is used and creates the schedule on "LabStaff" calendar for the user "Patrick"

function labStaff(userName){
   var parentSheet = SpreadsheetApp.openById("1LWct2ByX7_GCNXXQw_h8_qDHHAJpps13zC48IN44950")
   var sheet = parentSheet.getSheetByName("Labs")
   var data = sheet.getRange("A4:H39").getValues()
   var endDate = new Date(data[0][0])
   endDate.setHours(17)
   var calendarName = "LabStaff"
   var eventName = calendarName + " Shift"
   var time1, time2
   var date1, date2
   // data contains dates formatted like this "Mon Sep 28 00:00:00 GMT-07:00 2015"

   
   for(y=0; y < 18; y++){ // last hour block occurs in 18th cell of data for the lab sheet
     for(x=0; x < data[0].length; x++){
       if(data[y][x] == userName){
         time1 = new Date(data[y][0])
         date1 = new Date(data[0][x])
         time2 = new Date(data[y+2][0])
         date2 = new Date(data[0][x])
         createShift("LabStaff", eventName, time1, date1, time2, date2, endDate)
       }
     }
   }
   
   for(y=19; y < 22; y++){ // 6-8 block occurs in 19th cell of data for the lab sheet
     for(x=0; x < data[0].length; x++){
       if(data[y][x] == userName){
         time1 = new Date(data[y][0])
         date1 = new Date(data[0][x])
         time2 = new Date(data[y+4][0])
         date2 = new Date(data[0][x])
         createShift("LabStaff", eventName, time1, date1, time2, date2, endDate)
       }
     }
   }
   
    for(y=23; y < 29; y++){ // 8-11 block occurs in 23th cell of data for the lab sheet
     for(x=0; x < data[0].length; x++){
       if(data[y][x] == userName){
         time1 = new Date(data[y][0])
         date1 = new Date(data[0][x])
         time2 = new Date(data[y+6][0])
         date2 = new Date(data[0][x])
         createShift("LabStaff", eventName, time1, date1, time2, date2, endDate)
       }
     }
   }
   
    for(y=29; y < 35; y++){ // 11-2 block occurs in 29th cell of data for the lab sheet
     for(x=0; x < data[0].length; x++){
       if(data[y][x] == userName){
         time1 = new Date(data[29][0])
         date1 = new Date(data[0][x])
         time2 = new Date(data[35][0])
         date2 = new Date(data[0][x])
         date2.setDate(date2.getDate() + 1) // 11-2am shift changes dates
         createShift("LabStaff","Closing Lab", time1, date1, time2, date2, endDate)
       }
     }
   }

}


// Given a userName ("Patrick") this finds all of the locations on the scheduling sheet
//  where "Patrick" is used and creates the schedule on "Helpdesk" calendar for the user "Patrick".
//
// Could be modified by changing time2 location dynamically in the future. Shifts seem to 
//  be permanently set so it didn't seem to be an issue. 

function helpDeskStaff(userName){
   var sheets = SpreadsheetApp.openById("1LWct2ByX7_GCNXXQw_h8_qDHHAJpps13zC48IN44950")
   var deskSheet = sheets.getSheetByName("HelpDesk")
   var data = deskSheet.getRange("A4:H33").getValues()
   var endDate = new Date(data[0][0])
   endDate.setHours(17)
   var calendarName = "HelpDesk"
   var eventName = calendarName + " Shift"
   var time1, time2
   var date1, date2  
   
   for(y=0; y < 16; y++){ // last hour block occurs in 18th cell of data for the lab sheet
     for(x=0; x < data[0].length; x++){
       if(data[y][x] == userName){
         time1 = new Date(data[y][0])
         date1 = new Date(data[0][x])
         time2 = new Date(data[y+2][0])
         date2 = new Date(data[0][x])
         createShift(calendarName, eventName, time1, date1, time2, date2, endDate)
       }
     }
   }
   
   for(y=17; y < 29; y++){ //  2 hour time blocks from cell 17 to 29
     for(x=0; x < data[0].length; x++){
       if(data[y][x] == userName){
         time1 = new Date(data[y][0])
         date1 = new Date(data[0][x])
         time2 = new Date(data[y+4][0])
         date2 = new Date(data[0][x])
         createShift(calendarName, eventName, time1, date1, time2, date2, endDate)
       }
     }
   }

}



// Runs the functions that build the calendars. 
//  If the user is whdsched@gmail.com then it will build the calendar
//  used in the front page of the tempsite.

function getMySchedule(){
   
   var userName = getUserName()
   if(userName == "whd"){
     getSchedule()
   }
   else{
     addBoth()
     labStaff(userName)
     helpDeskStaff(userName)
  }
}
