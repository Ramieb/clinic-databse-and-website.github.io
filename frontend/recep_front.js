// Attach the event listener to the image element
document.getElementById('submit_filters').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the default action (form submission)
    
    submitForm();  // Call the submitForm function
});

// Function to handle the form submission
function submitForm() {
    // Get the form data
    const officeLoc = document.getElementById('office_loc').value;
    const apptDate = document.getElementById('appt_date').value;

    // Basic validation: Ensure both fields are filled in
    if (!officeLoc || !apptDate) {
        alert("Please select both office location and appointment date.");
        return;
    }

    // Prepare the data to send to the backend
    const formData = {
        office_loc: officeLoc,
        appt_date: apptDate
    };

    // Use Fetch API to send data to the backend
    fetch('../backend/routerFiles/receptionistRoute.js', {
        method: 'GET',  // Or 'POST' if your backend uses POST
        headers: {
            'Content-Type': 'application/json',  // Send data as JSON
        },
        body: JSON.stringify(formData)  // Send form data as JSON
    })
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        // Handle the response data (e.g., show available appointments)
        if (data.status === 'success') {
            document.getElementById('appointment_results').innerHTML = `
                <h2>Available Appointments</h2>
                <ul>
                    ${data.appointments.map(appt => `<li>${appt.time}</li>`).join('')}
                </ul>
            `;
        } else {
            document.getElementById('appointment_results').innerHTML = `
                <h2>No appointments found for this date and location.</h2>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('appointment_results').innerHTML = `
            <h2>Error checking appointments. Please try again later.</h2>
        `;
    });
}
