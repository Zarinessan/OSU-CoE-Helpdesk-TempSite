/**
 * Serves HTML of the application for HTTP GET requests.
 * If folderId is provided as a URL parameter, the web app will list
 * the contents of that folder (if permissions allow). Otherwise
 * the web app will list the contents of the root folder.
 *
 * @param {Object} e event parameter that can contain information
 *     about any URL parameters provided.
 */
/*function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index');

  // Retrieve and process any URL parameters, as necessary.
  if (e.parameter.folderId) {
    template.folderId = e.parameter.folderId;
  } else {
    template.folderId = 'root';
  }

  // Build and return HTML in IFRAME sandbox mode.
  return template.evaluate()
      .setTitle('Web App Window Title')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}*/
function doGet(e) {
  return HtmlService
    //.createHtmlOutputFromFile('Index')
    .createTemplateFromFile('Index')
     .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

/**
 * Return an array of up to 20 filenames contained in the
 * folder previously specified (or the root folder by default).
 *
 * @param {String} folderId String ID of folder whose contents
 *     are to be retrieved; if this is 'root', the
 *     root folder is used.
 * @return {Object} list of content filenames, along with
 *     the root folder name.
 */
function getFolderContents(folderId) {
  var topFolder;
  var contents = {
      children: []
  };

  if (folderId == 'root') {
    topFolder = DriveApp.getRootFolder();
  } else {
    // May throw exception if the folderId is invalid or app
    // doesn't have permission to access.
    topFolder = DriveApp.getFolderById(folderId);
  }
  contents.rootName = topFolder.getName() + '/';

  var files = topFolder.getFiles();
  var numFiles = 0;
  while (files.hasNext() && numFiles < 20) {
   var file = files.next();
   contents.children.push(file.getName());
   numFiles++;
  }
  return contents;
}


/**
**Description: Email address of the person running the script.
**Input:None
**Output: User's email address 
**/ 
function getEmail() {
  return Session.getActiveUser().getEmail();
}

function multipleEmail() {
  var emails = Session.getActiveUser().getEmail();
  Logger.log("emails = %s ", emails)
  return emails;
}

/**
**Description: Verifies the user is logged into the WHD gmail account
**Input:None
**Output: True if the current User is the owner, False if the 
**/ 
function isUserTheOwner(){
  var currentUser = Session.getActiveUser().getEmail();
  if (currentUser == "whdsched@gmail.com" || "colesda@onid.oregonstate.edu"){
    return true;
  }
  else{
    return false; 
  }
}

/**
**Description: Checks if an owner has a contact list 
**Input:  Contact Group Name 
**Output: True if contact name corresponds with a contact group
**        False if no contact group exists with the corresponding name
**/ 
function doesContactGroupExist(contactGroupName){
  var groupName = ContactsApp.getContactGroup(contactGroupName);
  if(groupName == null){
    return false;
  }
  return true; 
}

/**
**Description: Checks if the inputted emailed address exists in the contat group name  
**Input:  Contact Group Name, Contact Email Address   
**Output: True if contact name corresponds with a contact group
**        False if no contact group exists with the corresponding user first and last name
**/ 
function isActiveUserInContactGroup(contactGroupName, contactEmailAddress){
   if(doesContactGroupExist(contactGroupName) == true){
     var contacts = ContactsApp.getContactGroup(contactGroupName).getContacts();
     //Verify there is at least 1 contact in contact group.  
     if(contacts.length == 0){
       return false; 
     }
     else {
       for (var i = 0; i < contacts.length; i++) {
         //Log.logger("Test"); 
         if(contactEmailAddress == contacts[i].getPrimaryEmail()){
           return true;
         }

       }
       return false; 
     }
   }
   else{
     return false; 
   }
}



/**
**Description: Checks the Contact spreadsheet to verify the active user is either help desk staff,
** lab staff, or both
**Input:  None 
**Output: 0.  User is neither on the help desk staff list or lab staff list.
**        1.  User is on the help desk staff list. 
**        2.  User is on the lab staff list.
**        3.  User is on both the help desk staff list and the lab staff list. 
**/ 
function checkActiveUserWithContactSpreadsheet(){
   //For both onHelpDesk and onLab 1 means they are on the list and 0 means they are not. 
   var onHelpDesk = 0;
   var onLab = 0;
   var email = getEmail(); 
   Logger.log(email); 
   
   //Open Contacts spreadsheet.
   //Note the ID is in the contacts URL.
   try {
     var contacts = SpreadsheetApp.openById("1UINUmUWGpnNg83BlA1UEpVJsVCVI_TUQWBRQr8g1eMU");
     Logger.log(contacts.getName());
   }
   catch(err) {
     return 0; 
   }

   //Pulls the first sheet.
   var sheet = contacts.getSheets()[0];
   
   //Check Helpdesk column for match
   //The Max numbers of employees is assumed to be 50
   for(var i = 3; i < 54; i++){
     var range = sheet.getRange("D"+i).getValue();
     // Logs "2.0"
     Logger.log(range);
     if(range == email){
       onHelpDesk = 1; 
       Logger.log(onHelpDesk); 
       break;
     }
   }
   
   //Check Lab column for match
   //The Max numbers of employees is assumed to be 50
   for(var i = 3; i < 54; i++){
     var range = sheet.getRange("I"+i).getValue();
     // Logs "2.0"
     Logger.log(range);
     if(range == email){
       onLab = 1; 
       Logger.log(onLab);
       break; 
     }
   }

   //User is on both lab and helpdesk staff.
   if(onHelpDesk == 1 && onLab == 1){
     Logger.log("User on both HelpDesk and Lab Staff"); 
     return 3;
   }
   //User is only on lab staff. 
   else if(onHelpDesk == 0 && onLab == 1){
     Logger.log("User on Lab Staff"); 
     return 2;  
   }
   //User is only on helpdesk staff. 
   else if(onHelpDesk == 1 && onLab == 0){
     Logger.log("User on HelpDesk Staff"); 
     return 1; 
   }
   //Is neither on the lab or helpdesk list. 
   else{
     Logger.log("User is neither HelpDesk or Lab Staff");  
     return 0; 
   }
}


// Returns UserName from Contacts Sheet with email equal to the one currently logged in
function getUserName(){
  var email = getEmail()
  var userNameColumn = 0
  var emailColumn = 1
  var row = 0
  
  // Check if the email logged in is Helpdesk
  var data = SpreadsheetApp.openById("1UINUmUWGpnNg83BlA1UEpVJsVCVI_TUQWBRQr8g1eMU").getRange("C:D").getValues()
    while(1){                                                                             //heldesk range
    if(email == data[row+3][emailColumn]){
       //Logger.log("Email was found! Username: %s",data[row+3][userNameColumn] )
       return data[row+3][userNameColumn]
    }
    if(data[row+3][emailColumn] == ""){
      break
    }
    row = row + 1
  }
  
  row = 0 
  
  // Change data to check if the person logged in is Lab Staff
  data = SpreadsheetApp.openById("1UINUmUWGpnNg83BlA1UEpVJsVCVI_TUQWBRQr8g1eMU").getRange("H:I").getValues()
    while(1){                                                                          //labstaff range
    if(email == data[row+3][emailColumn]){
       //Logger.log("Email was found! Username: %s",data[row+3][userNameColumn] )
       return data[row+3][userNameColumn]
    }
    if(data[row+3][emailColumn] == ""){
      break
    }
    row = row + 1
  }
  
  Logger.log("Email not found! Current Email: %s", email)
  return "Error"
}


