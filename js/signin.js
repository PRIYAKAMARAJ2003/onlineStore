$(document).ready(function() {
    $('#signin-form').submit(function(event) {
      event.preventDefault(); // Prevent default form submission
  
      // Get form data
      var email = $('#email').val();
      var password = $('#password').val();

      
  
      // Check if email is for admin or customer
      var isAdmin = email.endsWith('@psiog.com');
  
      // Determine Firestore collection URL
      var collectionUrl = isAdmin ? "Admin" : "Customer";
  
      var userData = {
        fields: {
          "email": {stringValue: email},
          "password": {stringValue: password}
        }
      };
      // Send request to Firestore to check credentials
      $.ajax({
        url: "https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/" + collectionUrl + "?pageSize=100",
        type: "GET",
        success: function(response) {
          if(response.documents && response.documents.length >0 ){
          var documents = response.documents;
          var authenticated = false;
  
          // Iterate through the documents to check credentials
          for (var i = 0; i < documents.length; i++) {
            var doc = documents[i];
            var docFields = doc.fields;
  
            // Check email and password
            if (docFields.email.stringValue === email && docFields.password.stringValue === password) {
              authenticated = true;
              break;
            }
          }
  
          if (authenticated) {
            $('#message').text('Sign in successful!');
            // Redirect to dashboard or another HTML page
            if(isAdmin){
              window.location.href = "admin.html";
            }else{
              window.location.href = "indexorg.html";
            }
            // Replace "dashboard.html" with the desired page
          } else {
            $('#message').text('Invalid email or password.').show();
          }
        }else{
          $('#message').text('No documents found or unexpected response structure.').show();
          window.location.href = "signup.html";
        }
      },
        error: function(xhr, status, error) {
          $('#message').text('Error: ' + error);
        }
      });
    });

      // Forgot Password functionality
      $('#forgot-password-link').click(function(event) {
        event.preventDefault();
        $('signin-form').hide();
        $('#login-section').hide();
        $('#forgot-password-section').show();
    });

    // Update Password functionality
    $('.update-password-btn').click(function() {
        var email = $('#forgot-email').val();
        var newPassword = $('#new-password').val();
        var confirmPassword = $('#confirm-password').val();

        // Validate email and password fields
        if (email.trim() === '' || newPassword.trim() === '' || confirmPassword.trim() === '') {
            alert("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Make a PATCH request to update the password in Firestore
        var url = `https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/Customer/${email}`;
        var data = JSON.stringify({
            fields: {
                password: {
                    stringValue: newPassword
                }
            }
        });

        $.ajax({
            url: url,
            type: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data,
            success: function(response) {
                alert('Password updated successfully.');
                // Optionally, redirect to login page or handle further actions
            },
            error: function(xhr, status, error) {
                console.error('Error updating password:', error);
                alert('An error occurred. Please try again later.');
            }
        });
    });
  });
  
  