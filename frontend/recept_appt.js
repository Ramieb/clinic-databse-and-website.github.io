////////THIS IS FOR APPOINTMENT PAGE////////////////
// populate appt drop box with locations
async function populateOfficeLocations() {
    try {
        const response = await fetch('/api/receptionist/offices', {
            method: 'GET',  // Specify GET method
            headers: {
                'Content-Type': 'application/json',  // Expecting a JSON response
            },
        });

        // Check if the response was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

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

/*async function populateDoctors() {
    try {
        
        
    } catch (error) {
        console.error('Error fetching office locations:', error);
    }
}*/

function editAppointment(patient_id, app_date, app_start_time) {
    // You can add functionality to edit an appointment here
    alert('Editing appointment for Patient ID: ' + patient_id);
    // For example, you might redirect to an edit page or open a modal to edit the details
    // window.location.href = `/edit-appointment/${patientId}`;
}

async function deleteAppointment(patient_id, app_date, app_start_time) {
    // Confirm deletion
    const confirmDelete = confirm('Are you sure you want to delete this appointment?');

    if (confirmDelete) {
        try {
            // Send a DELETE request to the backend to delete the appointment
            const response = await fetch('/api/receiptionist/appointments', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patient_id: patient_id,
                    app_date: app_date,
                    app_start_time: app_start_time
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Appointment deleted successfully');
                // Optionally, refresh the appointment list after successful deletion
                location.reload(); // This will reload the page and fetch the updated appointments
            } else {
                alert(result.message || 'Error deleting appointment.');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            alert('An error occurred. Please try again later.');
        }
    }
}

// Handle form submission to check available appointments
async function submitApptFilters() {
    // Get form values
    const officeLoc = parseInt(document.getElementById('office_loc').value);
    const apptDate = document.getElementById('appt_date').value;
    const doc = document.getElementById('doctors').value;
    
    // Validate the form
    if (!officeLoc || !apptDate) {
        alert('Please select at least office location and appointment date.');
        return;
    }

    // Prepare data to send to the backend
    const formData = {
        office_id: officeLoc,
        date: apptDate,
        doctor: doc || null
    };

    try {
        // Send the data to the backend to get available appointments
        const response = await fetch('/api/receptionist/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        const resultsContainer = document.getElementById('appointment_results');
        resultsContainer.innerHTML = ''; // Clear the previous content

        // Handle the response
        if (data.status === 'success') {
            // Display available appointments (adjust based on the new response structure)
            resultsContainer.innerHTML = `
                <h2>All Appointments</h2>
                <ul>
                    ${data.appointments.map(appt => `
                        <li>
                            Patient: ${appt.patient_first_name} ${appt.patient_last_name}, 
                            Doctor: ${appt.doctor_first_name} ${appt.doctor_last_name}, 
                            Date: ${appt.app_date},
                            Time: ${appt.app_start_time}, 
                            Reason: ${appt.reason_for_visit}, 
                            Location: ${appt.app_location}

                            <button class="edit-button" onclick="editAppointment('${appt.patient_id}', '${appt.app_date}', '${appt.app_start_time}')">Edit</button>
                            <button class="delete-button" onclick="deleteAppointment('${appt.patient_id}', '${appt.app_date}', '${appt.app_start_time}')">Delete</button>
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

document.getElementById('appointmentForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(appointmentForm);
    const appointmentData = Object.fromEntries(formData);

    // Add username to the appointment data
    appointmentData.username = username;

    console.log('Submitting appointment data:', appointmentData); // Debug log

    try {
        const result = await addAppointment(appointmentData);

        if (result.success) {
            feedbackDiv.textContent = 'Appointment scheduled successfully!';
            feedbackDiv.style.color = 'green';
            appointmentForm.reset();
            fetchAppointments(username); // Refresh the list
        } else {
            feedbackDiv.textContent = `Error: ${result.error || 'Unknown error'}`;
            feedbackDiv.style.color = 'red';
        }
    } catch (error) {
        feedbackDiv.textContent = error.message || 'Error scheduling appointment.';
        feedbackDiv.style.color = 'red';
    }
});

async function createNewAppt(){
    const resultsContainer = document.getElementById('appointment_results');
    resultsContainer.innerHTML = ''; // Clear the previous content

    /*resultsContainer.innerHTML = `
            <form id="appointmentForm">
                <label for="app_date">Appointment Date:</label>
                <input name="app_date" type="date" required />
            
                <label for="app_start_time">Start Time:</label>
                <input name="app_start_time" type="time" required />
            
                <label for="D_ID">Doctor ID:</label>
                <select name="D_ID" required>
                    <option value="123456789">John Doe (Cardiology)</option>
                    <option value="234567890">Alice Smith (Pediatrics)</option>
                    <option value="345678901">Bob Johnson (Family Medicine)</option>
                    <option value="456789012">Charlie White (Internal Medicine)</option>
                    <option value="567890123">Diana Lee (Neurology)</option>
                </select>
            
                <label for="reason_for_visit">Reason for Visit:</label>
                <input name="reason_for_visit" type="text" required />
            
                <button type="submit">Submit</button>
            </form>`;*/
}

// Attach the event listener to the image element
document.getElementById('submit_filters').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the default action (form submission)
    
    submitApptFilters();  // Call the submitForm function
});

document.getElementById('new_appt').addEventListener('click', createNewAppt);
///////////////////////////////////////////////////////////
