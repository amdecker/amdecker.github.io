/**
Displays the Google Drive File Picker when loadPicker() is called
https://developers.google.com/picker/docs/

With very few modifications (like making it so that the user can only select folders) the code is from google
https://developers.google.com/drive/api/v3/picker

@author: Amos Decker (but mostly Google)
**/
    // The Browser API key obtained from the Google API Console.
    // Replace with your own Browser API key, or your own key.
    var developerKey = 'AIzaSyABa-nvknSIyXkY28Oj3zjSSEsntvxD9Jw';

    // The Client ID obtained from the Google API Console. Replace with your own Client ID.
    var clientId = "237599765078-ssmn8r7clt73egves3l9j02678e8j03h.apps.googleusercontent.com"

    // Replace with your own project number from console.developers.google.com.
    // See "Project number" under "IAM & Admin" > "Settings"
    var appId = "237599765078";

    // Scope to use to access user's Drive items.
    var scope = ['https://www.googleapis.com/auth/drive'];

    var pickerApiLoaded = false;
    var oauthToken;

    // Use the Google API Loader script to load the google.picker script.
    function loadPicker() {
        document.getElementById('operation').innerHTML = ''
        document.getElementById('progress').innerHTML = '';
      gapi.load('auth', {'callback': onAuthApiLoad});
      gapi.load('picker', {'callback': onPickerApiLoad});
    }

    function onAuthApiLoad() {
      window.gapi.auth.authorize(
          {
            'client_id': clientId,
            'scope': scope,
            'immediate': false
          },
          handleAuthResult);
    }

    function onPickerApiLoad() {
      pickerApiLoaded = true;
      createPicker();
    }

    function handleAuthResult(authResult) {
      if (authResult && !authResult.error) {
        oauthToken = authResult.access_token;
        createPicker();
      }
    }

    // Create and render a Picker object for searching images.
    function createPicker() {
      if (pickerApiLoaded && oauthToken) {
        var view = new google.picker.DocsView(google.picker.ViewId.FOLDERS);
        view.setMimeTypes("application/vnd.google-apps.folder");
        view.setSelectFolderEnabled(true)
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.NAV_HIDDEN)
            //.enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(appId)
            .setOAuthToken(oauthToken)
            .addView(view)
            .addView(new google.picker.DocsUploadView())
            .setDeveloperKey(developerKey)
            .setCallback(pickerCallback)
            .build();
         picker.setVisible(true);
      }
    }

    // A simple callback implementation.
    function pickerCallback(data) {
      if (data.action == google.picker.Action.PICKED) {
        var fileId = data.docs[0].id;
        copy(fileId)
        //alert('The user selected: ' + fileId);
      }
    }