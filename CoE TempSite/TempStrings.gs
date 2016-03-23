

// Creates array of strings containing formatted information for html parsing
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




