/*
 Up to around line 105 the code is with some modifications from https://developers.google.com/drive/api/v3/quickstart/js
 @author Amos Decker
 
 This the second part of the code after the google stuff allows users to find all files in a certain parent folder and then copy all the files while maintaining the original file structure
*/


totalNumFiles = 0 // this is used to update the progress bar in canvas.js

var folderMimeType = "application/vnd.google-apps.folder"

// Client ID and API key from the Developer Console
var CLIENT_ID = '237599765078-ssmn8r7clt73egves3l9j02678e8j03h.apps.googleusercontent.com'
var API_KEY = 'AIzaSyABa-nvknSIyXkY28Oj3zjSSEsntvxD9Jw'

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]

// Authorization scopes required by the API multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive'

var authorizeButton = document.getElementById('authorize_button')
var signoutButton = document.getElementById('signout_button')

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient)
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function() {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
        authorizeButton.onclick = handleAuthClick
        signoutButton.onclick = handleSignoutClick
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2))
    })
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none'
        signoutButton.style.display = 'inline-block'
    } else {
        authorizeButton.style.display = 'inline-block'
        signoutButton.style.display = 'none'
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    document.getElementById("operation").innerHTML = ""
    document.getElementById("progress").innerHTML = ""
    clearCanvas()
    
    gapi.auth2.getAuthInstance().signIn()
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    document.getElementById("operation").innerHTML = ""
    document.getElementById("progress").innerHTML = ""
    clearCanvas()
    
    gapi.auth2.getAuthInstance().signOut()
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content')
    var textContent = document.createTextNode(message + '\n')
    pre.appendChild(textContent)
}
//----------
// NOTE: above this point the code is mostly from google's quickstart with some small modifications https://developers.google.com/drive/api/v3/quickstart/js
//----------

var getFile = function(id)
/* to use do var file = await getFile(<FILE-ID>)
then you can do file.result.id or .result.name etc

This will give back a file and you can access its id, name, parents, and mimeType

mimeType is what type of document (or if it is a folder) it is*/
{
    return new Promise( 
        function(resolve, reject)
        { 
            resolve(gapi.client.request({"path":"drive/v3/files/" + id, "method":"GET", "params":{"fileId": id, "fields":"id, name, parents, mimeType"}}))

        })
}

var createFile = function(name, parent)
/* creates a folder with a certain name and parent */
{
    var body = {"name":name, "mimeType": folderMimeType, "parents":[parent], "fields":"id"}
    console.log("PARENT: " + parent)
    return new Promise(
    function(resolve, reject)
    {
        resolve(gapi.client.request({"path":"drive/v3/files/", "method":"POST", "body":body}))
    })
}


var copyFile = function(id, parent, name)
/* copies a file with given id and places it in given parent folder with given name */
{
    var parameters = {"id": id}
    var body = {"parents": [parent], "name":name}
    return new Promise(
    function(resolve, reject)
    {
        resolve(gapi.client.request({"path":"drive/v3/files/" + id + "/copy", "method":"POST", "body":body, "params":parameters}))
        reject("File Not Copied: " + id)
    })
}


var listFiles = function(folderId, nextPageToken)
/* Given a folderId, it finds up to 500 files. If there are more than 500 files, there will be multiple pages of results, so you can call this again giving it nextPageToken. The first time running this you can leave nextPageToken as "". If there is no folderId given, it will just return files from a variety of folders  */
{
    return new Promise(
    function(resolve, reject)
    {
        
        parameters = {"pageSize": 500,
                    "fields": "nextPageToken, files(id, name, mimeType, parents, trashed)"}
        // if a folder is given, search within that folder
        if (folderId)
        {
            parameters["q"] = "'" + folderId + "' in parents" // certain folder in each item's parents list
        }
        // if there are mult pages of results and the nextPageToken is given, then look in the new page of results
        if (nextPageToken)
        {
            parameters["pageToken"] = nextPageToken
        }
        resolve(gapi.client.drive.files.list(parameters))
    })
}

        
async function copyFileStructure(fileStructure, topParentFolder)
/* Goes through each folder and copies all the items in there and places them in a folder called COPIES while retaining the original file structure */
{
    // the var fileStructure is organized like this:
    // {'a':[1, 2, 'b'], 'b':[3, 4]}    or 
    //  {'b':[3, 4, 'c'], 'c':[5, 6], 'a':[1, 2, 'b']}
    document.getElementById("operation").innerHTML = "Copying Files..."

    var allFolders = Object.keys(fileStructure)
    var foldersToCopy = [topParentFolder]
    var numFoldersCopied = 0 // just keeps track of num new folders created (aka copied)
    var numFilesCopied = 0 // keeps track of total num of files and folders copied
    
    // update UI
    document.getElementById("progress").innerHTML = numFilesCopied + "/" + totalNumFiles + " files copied"

    var i = 0 
    
    var copyFolder = await createFile("Copy of " + (await getFile(topParentFolder)).result.name, "root") // the folder that all the new copies will be placed in
    
    var originalAndCopyFolder = {} // in form of {original: copied version} for all folders
    originalAndCopyFolder[topParentFolder] = copyFolder.result.id
    
    console.log(originalAndCopyFolder)
    
    // while not all the files have been copied
    while(numFoldersCopied != allFolders.length)
    {
        var itemsToCopy = fileStructure[foldersToCopy[i]] // gets id of the file/folder dealing with at moment
        if (!itemsToCopy){break}
        
        // for each item in this folder
        for (var f = 0; f < itemsToCopy.length; f++)
        {
            var fileToCopy = (await getFile(itemsToCopy[f])).result // original file
            console.log(fileToCopy)
            
            // get the right parent that matches what I have in originalAndCopyFolder
            for(var x = 0; x < fileToCopy.parents.length; x++)
            {
                var newParent = originalAndCopyFolder[fileToCopy.parents[x]] // get copied counterpart parent where the copied file/folder will be placed
                if(newParent){break}
            }
            // if it is a folder, make a new folder with the same name (you can't make copies of folders – you have to make a new folder)
            if (fileToCopy.mimeType == folderMimeType)
            {
                foldersToCopy = foldersToCopy.concat(itemsToCopy[f]) // since the current file is a folder, it is added to the list of folders that need to go though to copy all files
                originalAndCopyFolder[fileToCopy.id] = (await createFile(fileToCopy.name, newParent)).result.id // add to counterpart list
                numFoldersCopied++
            }
            // if it is a file, copy the file
            else
            {
                try
                {
                    await copyFile(itemsToCopy[f], newParent, fileToCopy.name)
                }
                catch(e)
                {
                    console.log("Could not copy: " + fileToCopy.name + ", id: " + itemsToCopy[f])
                    appendPre("Could not copy: " + fileToCopy.name + ", id: " + itemsToCopy[f])
                }
            }
            numFilesCopied++
            console.log(numFilesCopied + "/" + totalNumFiles)
            
            // update UI/canvas
            document.getElementById("progress").innerHTML = numFilesCopied + "/" + totalNumFiles + " files copied"
            showProgress(numFilesCopied / totalNumFiles)
        }
        i++
    }
    console.log("DONE. COPIED")
    showDone() // update canvas
}

async function copy(topParentFolder)
/* Does all the processes needed to copy stuff in a folder. It first finds all the files in the topParentFolder then it structures them with files that have the same parent grouped together. Then it calls copyFileStructure which does the actual copying */
{
    totalNumFiles = 0 // reset counter every time new set of files is copied - allows user to select another folder after the previous one has been copied
    var folderMimeType = "application/vnd.google-apps.folder"

    var fileStructure = {}
    fileStructure[topParentFolder] = []
    console.log(fileStructure)
    
    var foldersSearched = []
    
    var haveAllFiles = false
    document.getElementById("operation").innerHTML = "Gathering Files..." // update UI
    
    // FIND ALL THE FILES
    while(!haveAllFiles)
    {
        // get a folder to search
        var folderToSearch;
        var possibleFolders = Object.keys(fileStructure)
        var f = 0;
        var haveFolderToSeach = false
        while(!haveFolderToSeach)
        {
            folderToSearch = possibleFolders[f]
            if (!foldersSearched.includes(folderToSearch)){break}
            f++
        }
        console.log(folderToSearch)
        
        // if there are no possible folders to search left, then the process is done
        if(!folderToSearch)
        {
            console.log("DONE!!!")
            break
        }
        
        // GET ALL FILES in that folder
        var listPromise = await listFiles(folderToSearch)
        var nextPageToken = "sjhldf"
        var allFiles = []
        // while there are still more pages of results, get the files
        while (nextPageToken != listPromise.result.nextPageToken && nextPageToken)
        {
            nextPageToken = listPromise.result.nextPageToken
            allFiles = allFiles.concat(listPromise.result.files)
            totalNumFiles += listPromise.result.files.length
            document.getElementById("progress").innerHTML = totalNumFiles + " files found" // update UI
            listPromise = await listFiles(folderToSearch, nextPageToken)
        }
        
        // ADD the files to the file system
        // filesystem is structured like this: {'a':[1, 2, 'b'], 'b':[3, 4]} where the letters are folders and the numbers are files
        fileStructure[folderToSearch] = []
        for (var i = 0; i < allFiles.length; i++)
        {
            console.log("TRASHED: " + allFiles[i].trashed)
            if(allFiles[i].trashed)
            {
                totalNumFiles -= 1
                continue
            }

            fileStructure[folderToSearch] = fileStructure[folderToSearch].concat(allFiles[i].id)

            // if it is a folder, add value: [] for key: id
            if (allFiles[i].mimeType == folderMimeType)
            {
                fileStructure[allFiles[i].id] = []
            }
        }
        
        foldersSearched = foldersSearched.concat(folderToSearch)
    }
    console.log(fileStructure)
    copyFileStructure(fileStructure, topParentFolder)
}

