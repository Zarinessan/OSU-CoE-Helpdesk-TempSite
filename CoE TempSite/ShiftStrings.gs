
// Sorts array of strings based on date. (Monday Lab, Monday Helpdesk, Tuesday Helpdesk)
function sortStrings(both){
  var list = []
  var returnList = []
  for(i = 0; i < both.length; i++){
    var temp = both[i].split(",")
    list.push([new Date(temp[0]), temp[0] +","+ temp[1] +"," + temp[2] +","+ temp[3] +","+ temp[4]])
  }
  
  list.sort(function(a, b)
  {
    return a[0].valueOf() - b[0].valueOf();
  });
  
  for(i = 0; i < list.length; i++){
    returnList.push(list[i][1])
  }

  return returnList
}

// Called by labStrings and deskStrings
// Used to format the information provided into a string to be parsed by HTML later
//
// Parameters:
// calendarName - Either "Helpdesk" or "LabStaff". Used to determine typeShift (could be improved or used a different way)
// eventName - Not used in this iteration. Might be useful later. 
// time1 - starting hours of the shift. Obtained from spreadsheet (date object)
// date1 - starting date of the shift. Obtained from spreadsheet (date object)
// time2 - ending hours of the shift. Obtained from spreadsheet (date object)
// date2 - ending date of the shift. Only different from date1 if 11-2am shift. (date object)
//
// Returned:
// newString - String formatted "startShift ("Mon Sep 28 00:00:00 GMT-07:00 2015"), 
//                                + hour shift starts (0-23), 
//                                + hour shift ends (0-23),
//                                + name of shift owner (Patrick),
//                                + type of shift (helpdesk)"
//
function createShiftString(calendarName, eventName, time1, date1, time2, date2, endDate){
    
    var typeShift = ""
    if(calendarName == "HelpDesk"){
      typeShift = "helpdesk"
    }
    else{
      typeShift = "lab"
    }
    var startShift = new Date(date1.setHours(time1.getHours()))
    var endShift = new Date(date2.setHours(time2.getHours()))
    var newString = startShift.toString()
                    + "," + startShift.getHours()
                    + "," + endShift.getHours()
                    + "," + getUserName()
                    + "," + typeShift
    //Logger.log("newString = %s", newString)
    return newString
}


// Called by getBothStrings
// Parses Schedule spreadsheet and creates a list of strings of the current user's lab shifts to be parsed by HTML. 
function labStrings(){
   var userName = getUserName()
   var parentSheet = SpreadsheetApp.openById("1LWct2ByX7_GCNXXQw_h8_qDHHAJpps13zC48IN44950")
   var sheet = parentSheet.getSheetByName("Labs")
   var data = sheet.getRange("A4:H39").getValues()
   var endDate = new Date(data[0][0])
   endDate.setHours(17)
   var calendarName = "LabStaff"
   var eventName = calendarName + " Shift"
   var time1, time2
   var date1, date2
   var shiftStrings = []
   var tempStrings = []
   var finalList = []
   var today = new Date()
  
   //Logger.log("data[0].length = %s, data.length = %s", data[0].length, data.length)
   
   for(y=0; y < 18; y++){ // last hour block occurs in 18th cell of data for the lab sheet
     for(x=0; x < data[0].length; x++){
       if(data[y][x] == userName){
         time1 = new Date(data[y][0])
         date1 = new Date(data[0][x])
         time2 = new Date(data[y+2][0])
         date2 = new Date(data[0][x])
         //shiftStrings.push(createShiftString("LabStaff", eventName, time1, date1, time2, date2))
         while(date1.valueOf() < endDate.valueOf()){
           if(date1.valueOf() > today.valueOf()){
             shiftStrings.push(createShiftString("LabStaff", eventName, time1, date1, time2, date2))
           }
           date1.setDate(date1.getDate() + 7)
         }         
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
         //shiftStrings.push(createShiftString("LabStaff", eventName, time1, date1, time2, date2))       
         while(date1.valueOf() < endDate.valueOf()){
           if(date1.valueOf() > today.valueOf()){
             shiftStrings.push(createShiftString("LabStaff", eventName, time1, date1, time2, date2))
           }
           date1.setDate(date1.getDate() + 7)
         }         
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
         while(date1.valueOf() < endDate.valueOf()){
           if(date1.valueOf() > today.valueOf()){
             shiftStrings.push(createShiftString("LabStaff", eventName, time1, date1, time2, date2))
           }
           date1.setDate(date1.getDate() + 7)
         }  
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
         date2.setDate(date2.getDate() + 1)
         while(date1.valueOf() < endDate.valueOf()){
           if(date1.valueOf() > today.valueOf()){
             shiftStrings.push(createShiftString("LabStaff", eventName, time1, date1, time2, date2))
           }
           date1.setDate(date1.getDate() + 7)
         }  
       }      
     }
   }
   
   
// checking to see if the shifts are on the Current Temp spreadsheet before returning the strings to be parsed by HTML
   var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0")
   data = sheet.getRange("A1:G").getValues()
   for(y = 0; y < data.length; y++){
     if(data[y][0] == userName && data[y][2] == "lab"){
       var newString = new Date(data[y][3]).toString()
                    + "," + new Date(data[y][3]).getHours()
                    + "," + new Date(data[y][4]).getHours()
                    + "," + userName
                    + "," + "lab"
       tempStrings.push(newString)
     }
   }
   for(i = 0; i < tempStrings.length; i++){
     Logger.log("TempString[%s] = %s", i, tempStrings[i])
   }

   for(i = 0; i < shiftStrings.length; i++){
     if(tempStrings.indexOf(shiftStrings[i]) == -1){
       finalList.push(shiftStrings[i])
       Logger.log("%s ! in list", shiftStrings[i])
     }
     else{
       Logger.log("shift found: %s    position: %s    i: %s", shiftStrings[i], tempStrings.indexOf(shiftStrings[i]), i)
     }
   }
   Logger.log("#ShiftStrings = %s, #FinalList = %s", shiftStrings.length, finalList.length)
   return finalList
}


function deskStrings(){
   var userName = getUserName()
   var sheets = SpreadsheetApp.openById("1LWct2ByX7_GCNXXQw_h8_qDHHAJpps13zC48IN44950")
   var deskSheet = sheets.getSheetByName("HelpDesk")
   var data = deskSheet.getRange("A4:H33").getValues()
   var endDate = new Date(data[0][0])
   endDate.setHours(17)
   var calendarName = "HelpDesk"
   var eventName = calendarName + " Shift"
   var time1, time2
   var date1, date2
   var shiftStrings = []
   var tempStrings = []
   var finalList = []
   var today = new Date()
   // data contains dates formatted like this "Mon Sep 28 00:00:00 GMT-07:00 2015"
  
   Logger.log("data[0].length = %s, data.length = %s", data[0].length, data.length)
   
   for(y=0; y < 16; y++){ // last hour block occurs in 18th cell of data for the lab sheet
     for(x=0; x < data[0].length; x++){
       if(data[y][x] == userName){
         time1 = new Date(data[y][0])
         date1 = new Date(data[0][x])
         time2 = new Date(data[y+2][0])
         date2 = new Date(data[0][x])
         //shiftStrings.push(createShiftString(calendarName, eventName, time1, date1, time2, date2))
         while(date1.valueOf() < endDate.valueOf()){
           if(date1.valueOf() > today.valueOf()){
             shiftStrings.push(createShiftString("HelpDesk", eventName, time1, date1, time2, date2))
           }
           date1.setDate(date1.getDate() + 7)
         }       
       }
     }
   }
   
   for(y=17; y < 29; y++){ // 6-8 block occurs in 19th cell of data for the lab sheet
     for(x=0; x < data[0].length; x++){
       if(data[y][x] == userName){
         time1 = new Date(data[y][0])
         date1 = new Date(data[0][x])
         time2 = new Date(data[y+4][0])
         date2 = new Date(data[0][x])
         //shiftStrings.push(createShiftString(calendarName, eventName, time1, date1, time2, date2))
         while(date1.valueOf() < endDate.valueOf()){
           if(date1.valueOf() > today.valueOf()){
             shiftStrings.push(createShiftString("HelpDesk", eventName, time1, date1, time2, date2))
           }
           date1.setDate(date1.getDate() + 7)
         }
       }
     }
   }
     
   
   var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0")
   data = sheet.getRange("A1:G").getValues()
   for(y = 0; y < data.length; y++){
     if(data[y][0] == userName && data[y][2] == "helpdesk"){
       var newString = new Date(data[y][3]).toString()
                    + "," + new Date(data[y][3]).getHours()
                    + "," + new Date(data[y][4]).getHours()
                    + "," + userName
                    + "," + "helpdesk"
       tempStrings.push(newString)
     }
   }
   
 for(i = 0; i < shiftStrings.length; i++){
     if(tempStrings.indexOf(shiftStrings[i]) == -1){
       finalList.push(shiftStrings[i])
     }
     else{
       Logger.log("shift found: %s    position: %s    i: %s", shiftStrings[i], tempStrings.indexOf(shiftStrings[i]), i)
     }
   }
   
   Logger.log("#ShiftStrings = %s, #FinalList = %s", shiftStrings.length, finalList.length)
   Logger.log(finalList[0])
   return finalList
}


function getBothStrings(){
  var labs = labStrings()
  var desk = deskStrings()
  var both = labs.concat(desk)
  return sortStrings(both)
  
}

// Builds strings out of all the temp shift information from Current Temps
function getTempStrings(){
  var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0");
  var lastRow = sheet.getLastRow()
  var range = sheet.getRange("A:G")
  
  var array = new Array() 
  var count = 0
  for(y = 1; y < sheet.getLastRow(); y++){
    var originalOwner = range.getCell(y+1, 1).getValue()
    var datePosted = range.getCell(y+1, 2).getValue()
    var typeShift = range.getCell(y+1, 3).getValue()
    var shiftStart = range.getCell(y+1, 4).getValue()
    var shiftEnd = range.getCell(y+1, 5).getValue()
    
    var getStartTimeHours = shiftStart.getHours()
    var getEndTimeHours = shiftEnd.getHours()
    var startTimeInt = parseInt(getStartTimeHours)
    var endTimeInt = parseInt(getEndTimeHours)
    var timeString = startTimeInt + "00 - " + endTimeInt + "00"
    
    
    
    var isTaken = range.getCell(y+1, 6).getValue()
    if (isTaken != "yes"){
      
      array[count] = shiftStart + "," + startTimeInt + "," + endTimeInt + "," + originalOwner + "," + typeShift 
      count = count + 1 
      Logger.log(array[count])
    }
    
  }
  return array 
}


// creates list of strings for the current temps that are already taken.
function getTakenTempStrings(){
  var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0");
  var lastRow = sheet.getLastRow()
  var range = sheet.getRange("A:G")
  
  var array = new Array() 
  var count = 0
  for(y = 1; y < sheet.getLastRow(); y++){
    var originalOwner = range.getCell(y+1, 1).getValue()
    var datePosted = range.getCell(y+1, 2).getValue()
    var typeShift = range.getCell(y+1, 3).getValue()
    var shiftStart = range.getCell(y+1, 4).getValue()
    var shiftEnd = range.getCell(y+1, 5).getValue()
    var newOwner = range.getCell(y+1, 7).getValue() 
    
    var getStartTimeHours = shiftStart.getHours()
    var getEndTimeHours = shiftEnd.getHours()
    var startTimeInt = parseInt(getStartTimeHours)
    var endTimeInt = parseInt(getEndTimeHours)
    var timeString = startTimeInt + "00 - " + endTimeInt + "00"
    
    
    
    var isTaken = range.getCell(y+1, 6).getValue()
    if (isTaken == "yes"){
      
      array[count] = shiftStart + "," + startTimeInt + "," + endTimeInt + "," + originalOwner + "," + typeShift + "," + newOwner 
      count = count + 1 
      Logger.log(array[count])
    }
    
  }
  return array 
}






