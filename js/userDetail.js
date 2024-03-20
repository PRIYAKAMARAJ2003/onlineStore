$(document).ready(function() {
    // Fetch user data from the API
    fetch("https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/Customer")
        .then(response => response.json())
        .then(data => {
            if (data.documents && data.documents.length > 0) {
                // Assuming the first document contains the user details
                data.documents.forEach(doc => {
                    const userDetails = doc.fields;
                    displayUserDetails(userDetails);
                });
                // const userDetails = data.documents[0].fields;
                // displayUserDetails(userDetails); // Call function to display user details
            } else {
                displayErrorMessage('No user details found.'); // Show error message if no user details found
            }
        })
        .catch(error => {
            displayErrorMessage('Error fetching user details: ' + error); // Show error message if fetching fails
        });
});

// Function to display user details
function displayUserDetails(userDetails) {
    // Get the credit value
    const creditValue = userDetails.credit ? userDetails.credit.integerValue : 'N/A';
    // Construct HTML to display user details
    const userDetailsHTML = `
        <h2>User Details</h2>
        <p><strong>Name:</strong> ${userDetails.name ? userDetails.name.stringValue : 'N/A'}</p>
        <p><strong>Email:</strong> ${userDetails.email ? userDetails.email.stringValue : 'N/A'}</p>
        <p><strong>PhoneNo:</strong> ${userDetails.phoneNo ? userDetails.phoneNo.integerValue : 'N/A'}</p>
        <p><strong>Address:</strong> ${userDetails.address ? userDetails.address.stringValue : 'N/A'}</p>
        <p><strong>Credit:</strong> ${userDetails.credit ? userDetails.credit.integerValue : 'N/A'}</p>
    `;
    // Append user details to the container
    $('#user-details-container').append(userDetailsHTML);
}

// Function to display error message
function displayErrorMessage(message) {
    $('#user-details-container').html(`<p>${message}</p>`);
}

// Function to display error message
function displayErrorMessage(message) {
    $('#user-details-container').html(`<p>${message}</p>`);
}


$(document).ready(function() {
    // Fetch user data from the API
    fetch("https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/Customer")
        .then(response => response.json())
        .then(data => {
            if (data.documents && data.documents.length > 0) {
                // Populate the customer select dropdown
                data.documents.forEach(doc => {
                    const userDetails = doc.fields;
                    const customerId = doc.name.split('/').pop(); // Extract customer ID
                    const customerName = userDetails.name ? userDetails.name.stringValue : 'N/A';
                    $('#customer-select').append(`<option value="${customerId}">${customerName}</option>`);
                });
            } else {
                displayErrorMessage('No user details found.'); // Show error message if no user details found
            }
        })
        .catch(error => {
            displayErrorMessage('Error fetching user details: ' + error); // Show error message if fetching fails
        });
});

$(document).ready(function() {
// Add credit button click event
$('#add-credit-button').click(function() {
    const customerId = $('#customer-select').val();
    const creditValue = parseInt($('#credit-input').val());

    // Validate input
    if (!customerId) {
        alert('Please select a customer.');
        return;
    }

    if (isNaN(creditValue) || creditValue <= 0) {
        alert('Please enter a valid credit value.');
        return;
    }

    // Fetch existing user details first
    fetch(`https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/Customer/${customerId}`)
        .then(response => response.json())
        .then(data => {
            if (data.fields) {
                const existingDetails = data.fields;
                existingDetails.credit = { integerValue: creditValue }; // Update credit value

                // Perform AJAX call to update the user details
                const url = `https://firestore.googleapis.com/v1/projects/onlinestore-229ef/databases/(default)/documents/Customer/${customerId}`;
                const requestData = { fields: existingDetails };

                $.ajax({
                    url: url,
                    type: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify(requestData),
                    success: function(response) {
                        alert('Credit value updated successfully.');
                        // Clear the user details container and fetch updated user details
                        $('#user-details-container').empty();
                        fetchUserDetails();
                    },
                    error: function(error) {
                        console.error('Error updating user details:', error);
                        alert('An error occurred while updating user details. Please try again later.');
                    }
                });
            } else {
                alert('User details not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            alert('An error occurred while fetching user details. Please try again later.');
        });
});
});