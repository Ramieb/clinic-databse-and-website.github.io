// populate appt drop box with locations
async function populateOfficeLocations() {
    try {
        const response = await fetch('/api/offices');
        const offices = await response.json();

        const select = document.getElementById('office_loc');

        // Clear existing options (if any)
        select.innerHTML = '<option value="" disabled selected>Select office</option>';

        // Add new options dynamically
        offices.forEach(office => {
            const option = document.createElement('option');
            option.value = office.office_id; // ID or whatever unique value you want to send
            option.textContent = office.location; // The name to display
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching office locations:', error);
    }
}

// Call the function when the page loads
window.onload = populateOfficeLocations;


// Handle form submission to check available appointments
async function submitApptFilters() {
    // Get form values
    const officeLoc = document.getElementById('office_loc').value;
    const apptDate = document.getElementById('appt_date').value;
    
    // Validate the form
    if (!officeLoc || !apptDate) {
        alert('Please select both office location and appointment date.');
        return;
    }

    // Prepare data to send to the backend
    const formData = {
        office_id: officeLoc,
        date: apptDate
    };

    try {
        // Send the data to the backend to get available appointments
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        // Handle the response
        if (data.status === 'success') {
            // Display available appointments (adjust based on the new response structure)
            const resultsContainer = document.getElementById('appointment_results');
            resultsContainer.innerHTML = `
                <h2>Available Appointments</h2>
                <ul>
                    ${data.appointments.map(appt => `
                        <li>
                            Patient ID: ${appt.P_ID}, 
                            Doctor ID: ${appt.D_ID}, 
                            Time: ${appt.app_start_time}, 
                            Reason: ${appt.reason_for_visit}
                        </li>
                    `).join('')}
                </ul>
            `;
        } else {
            document.getElementById('appointment_results').innerHTML = `<h2>No appointments found.</h2>`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('appointment_results').innerHTML = `<h2>Error checking appointments. Please try again later.</h2>`;
    }
}

// Attach the event listener to the image element
document.getElementById('submit_filters').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the default action (form submission)
    
    submitApptFilters();  // Call the submitForm function
});


