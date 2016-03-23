function formatDayString(string) {
  if(string == 'Mon'){
    stringReturn = 'Monday'
    return stringReturn 
  }
  else if(string == 'Tue'){
    stringReturn = 'Tuesday'
    return stringReturn 
  }
  else if(string == 'Wed'){
    stringReturn = 'Wednesday'
    return stringReturn 
  }
  else if(string == 'Thu'){
    stringReturn = 'Thursday'
    return stringReturn 
  }
  else if(string == 'Fri'){
    stringReturn = 'Friday'
    return stringReturn 
  }
  else if(string == 'Sat'){
    stringReturn = 'Saturday'
    return stringReturn 
  }
  else if(string == 'Sun'){
    stringReturn = 'Sunday'
    return stringReturn 
  }
  return 'Formatting Day Error: ' + string 
}

function formatTypeString(string){
  if(string == 'helpdesk'){
    stringReturn = 'Helpdesk'
    return stringReturn 
  }
  else if(string == 'lab'){
    stringReturn = 'Lab'
    return stringReturn 
  }
  return 'Formtting Type Error: ' + string 
}