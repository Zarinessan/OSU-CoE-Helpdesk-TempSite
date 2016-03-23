function labSchedule(){
  //var whichHalf = "first"
  var parentSheet = SpreadsheetApp.openById("1LWct2ByX7_GCNXXQw_h8_qDHHAJpps13zC48IN44950")
  var sheet = parentSheet.getSheetByName("Labs")
  var dates = sheet.getRange("B4:H4").getValues()
  var temp = sheet.getRange("A4:B4")
  var endOfTerm = temp.getCell(1,1).getValue()
  var times = sheet.getRange("A5:A39").getValues()
  var schedule = sheet.getRange("B5:H38").getValues()
  var date1, date2
  var time1, time2
  
//  if(whichHalf == "first"){
//    endOfTerm.setDate(endOfTerm.getDate() - 43)
//    Logger.log(endOfTerm.toString())
//  }
 
  for(y = 0; y < 17; y++){
    for(x = 0; x < dates[0].length; x++)
      if(schedule[y][x] != ""){
        date1 = new Date(dates[0][x])
        date2 = new Date(dates[0][x])
        time1 = new Date(times[y][0])
        time2 = new Date(times[y+2][0])
        Logger.log("time1 = %s, time2 = %s",time1, time2)
        createShift("LabStaff", schedule[y][x], time1, date1, time2, date2, endOfTerm)
      }
  }
  
  for(y = 18; y < 22; y++){
    for(x = 0; x < dates[0].length; x++)
      if(schedule[y][x] != ""){
        date1 = new Date(dates[0][x])
        date2 = new Date(dates[0][x])
        time1 = new Date(times[y][0])
        time2 = new Date(times[y+4][0])
        Logger.log("time1 = %s, time2 = %s",time1, time2)
        createShift("LabStaff", schedule[y][x], time1, date1, time2, date2, endOfTerm)
      }
  }
  
  for(y = 22; y < 28; y++){
    for(x = 0; x < dates[0].length; x++)
      if(schedule[y][x] != ""){
        date1 = new Date(dates[0][x])
        date2 = new Date(dates[0][x])
        time1 = new Date(times[y][0])
        time2 = new Date(times[y+6][0])
        Logger.log("time1 = %s, time2 = %s",time1, time2)
        createShift("LabStaff", schedule[y][x], time1, date1, time2, date2, endOfTerm)
      }
  }
  
  for(y = 28; y < 34; y++){
    for(x = 0; x < dates[0].length; x++)
      if(schedule[y][x] != ""){
        date1 = new Date(dates[0][x])
        date2 = new Date(dates[0][x])
        date2.setDate(date2.getDate() + 1)
        time1 = new Date(times[28][0])
        time2 = new Date(times[34][0])
        Logger.log("time1 = %s, time2 = %s",time1, time2)
        createShift("LabStaff", schedule[y][x], time1, date1, time2, date2, endOfTerm)
    }
  }
}

function deskSchedule(){
  var sheet = SpreadsheetApp.openById("1LWct2ByX7_GCNXXQw_h8_qDHHAJpps13zC48IN44950")
  var deskSheet = sheet.getSheetByName("HelpDesk")
  var dates = deskSheet.getRange("B4:H4").getValues()
  var temp = deskSheet.getRange("A4:B4")
  var endOfTerm = temp.getCell(1,1).getValue()
  var times = deskSheet.getRange("A5:A39").getValues()
  var schedule = deskSheet.getRange("B5:H38").getValues()
  var date1, date2
  var time1, time2
  
  for(y = 0; y < 15; y++){
    for(x = 0; x < dates[0].length; x++)
      if(schedule[y][x] != ""){
        date1 = new Date(dates[0][x])
        date2 = new Date(dates[0][x])
        time1 = new Date(times[y][0])
        time2 = new Date(times[y+2][0])
        Logger.log("time1 = %s, time2 = %s",time1, time2)
        createShift("HelpDesk", schedule[y][x], time1, date1, time2, date2, endOfTerm)
      }
  }
  
  for(y = 15; y < 27; y++){
    for(x = 0; x < dates[0].length; x++)
      if(schedule[y][x] != ""){
        date1 = new Date(dates[0][x])
        date2 = new Date(dates[0][x])
        time1 = new Date(times[y][0])
        time2 = new Date(times[y+4][0])
        Logger.log("time1 = %s, time2 = %s",time1, time2)
        createShift("Helpdesk", schedule[y][x], time1, date1, time2, date2, endOfTerm)
    }
  }
}

function deleteOldSchedule(calendarName){
  var sheet = SpreadsheetApp.openById("1LWct2ByX7_GCNXXQw_h8_qDHHAJpps13zC48IN44950")
  var year = sheet.getRange("A1").getCell(1, 1).getValue()
  var fromDate = new Date(year,1,1,0,0,0);
  var toDate = new Date(year,12,31,0,0,0);

  // delete from Jan 1 to end of Jan 4, 2013

  var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
  var events = calendar.getEvents(fromDate, toDate);
  for(var i=0; i<events.length;i++){
    var ev = events[i];
    Logger.log(ev.getTitle()); // show event name in log
    ev.deleteEvent();
  }
}

function deleteOldHD(){
   deleteOldSchedule("HelpDesk")
}

function deleteOldLS(){
   deleteOldSchedule("LabStaff")
}

function getSchedule(){
   //deleteOld()
   addBoth()
   deskSchedule()
   labSchedule()
}
