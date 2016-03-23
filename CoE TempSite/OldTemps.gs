
// Called from oldTemps.
// Deletes temps that have expired and were not picked up
function removeOldTemps(){
  var sheet = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0")
  if( sheet.getLastRow() == 1){
    return
  }
  var data = sheet.getRange("A1:G"+sheet.getLastRow()).getValues()
  var startColumn = 3
  var takenColumn = 5


  for(i = sheet.getLastRow(); i > 1; i--){
    if(sheet.getRange("A1:G"+sheet.getLastRow()).getCell(i, 6).getValue() != "yes"){
      if(new Date(sheet.getRange("A1:G"+sheet.getLastRow()).getCell(i, 4).getValue().valueOf()) < new Date(getToday()).valueOf()){
        sheet.deleteRow(i)
      }
    }
  }
}
  
// Run via nightly trigger to move temps from Current Temps to Old Temps spreadsheets
function oldTemps() {
  removeOldTemps()
  var sheetCurr = SpreadsheetApp.openById("1VI8FiklNWt75_5J3nb_u5oy05hQe1b-48b_McG71HU0")
  var sheetOld = SpreadsheetApp.openById("1OrBzkdYdoTPh-j4ZC0ZT_gHyks8qq2uYKwqQKk7lgq8")
  var rangeCurr = sheetCurr.getRange("A1:G"+sheetCurr.getLastRow())
  var lastRow = sheetCurr.getLastRow()
  lastRow = lastRow + sheetOld.getLastRow()
  var rangeOld = sheetOld.getRange("A1:G"+lastRow)
  Logger.log("rangeOld last row = %s",rangeOld.getLastRow())
  var counter = 1
  
  for(i = 1; i < rangeOld.getLastRow() -1; i++){
    if(rangeOld.getCell(i, 1).getValue() == ""){
      break
    }
    else{
      counter++
    }
  }
  
  for(i = rangeCurr.getLastRow(); i > 1; i--){
    if(new Date(rangeCurr.getCell(i, 4).getValue()).valueOf() < new Date(getToday()).valueOf()){
      //Logger.log("LastRow = %s", rangeOld.getLastRow())
      rangeOld.getCell(counter, 1).setValue(rangeCurr.getCell(i, 1).getValue())
      //Logger.log("1 = %s", rangeCurr.getCell(i, 1).getValue())
      //Logger.log("Old = %s", rangeOld.getCell(rangeOld.getLastRow()+counter, 1).getValue())
      rangeOld.getCell(counter, 2).setValue(rangeCurr.getCell(i, 2).getValue())
      rangeOld.getCell(counter, 3).setValue(rangeCurr.getCell(i, 3).getValue())
      rangeOld.getCell(counter, 4).setValue(rangeCurr.getCell(i, 4).getValue())
      rangeOld.getCell(counter, 5).setValue(rangeCurr.getCell(i, 5).getValue())
      rangeOld.getCell(counter, 6).setValue(rangeCurr.getCell(i, 6).getValue())
      rangeOld.getCell(counter, 7).setValue(rangeCurr.getCell(i, 7).getValue())
      sheetCurr.deleteRow(i)
      counter= counter + 1
    }
    else{
      Logger.log("value = ", rangeCurr.getCell(i, 4).getValue())
      //Logger.log("%s > %s", new Date(rangeCurr.getCell(i, 4).getValue()).valueOf(), new Date(getToday()).valueOf())

    }
  }
}

