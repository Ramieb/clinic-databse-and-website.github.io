////////THIS IS FOR APPOINTMENT PAGE////////////////
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

async function populateDoctors() {
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

function editAppointment(patient_id, app_date, app_start_time) {
    // You can add functionality to edit an appointment here
    alert('Editing appointment for Patient ID: ' + patientId);
    // For example, you might redirect to an edit page or open a modal to edit the details
    // window.location.href = `/edit-appointment/${patientId}`;
}

async function deleteAppointment(patient_id, app_date, app_start_time) {
    // Confirm deletion
    const confirmDelete = confirm('Are you sure you want to delete this appointment?');

    if (confirmDelete) {
        try {
            // Send a DELETE request to the backend to delete the appointment
            const response = await fetch('/api/appointments', {
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

        const resultsContainer = document.getElementById('appointment_results');
        resultsContainer.innerHTML = ''; // Clear the previous content

        // Handle the response
        if (data.status === 'success') {
            // Display available appointments (adjust based on the new response structure)
            resultsContainer.innerHTML = `
                <h2>All Appointments</h2>
                <label for="choose_doc">Filter by Doctor:</label>
                <select id="choose_doc" name="choose_doc">
                    <option value="" disabled selected>Select Doctor</option>
                <button id="search_doc" onclick="populateDoctors(${appt.employee_ssn})">Search</button>
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

// Attach the event listener to the image element
document.getElementById('submit_filters').addEventListener('click', function(event) {
    event.preventDefault();  // Prevent the default action (form submission)
    
    submitApptFilters();  // Call the submitForm function
});
///////////////////////////////////////////////////////////



//////////////THIS IS FOR REGISTER PAGE////////////////////
// Add event listener to the register form
document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the default form submission (page reload)

    // Gather form data
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const dob = document.getElementById('dob').value;
    const street_address = document.getElementById('street_address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip_code = document.getElementById('zip_code').value;
    const country = document.getElementById('country').value;
    const phone_number = document.getElementById('phone_number').value;
    const role = document.getElementById('role').value;

    // Validate the form data (basic validation)
    if (!first_name || !last_name || !dob || !phone_number || !role) {
        alert('Please fill out all required fields.');
        return;
    }

    // Combine the address information into a single string
    const fullAddress = `${street_address}, ${city}, ${state} ${zip_code}, ${country}`;
    // Create the form data object
    const formData = {
        first_name,
        last_name,
        dob,
        address: fullAddress,
        phone_number,
        role
    };

    try {
        // Send the form data to the backend
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)  // Send the form data as JSON
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration successful!');
            // Optionally, clear the form or redirect to another page
            document.getElementById('registerForm').reset();
        } else {
            alert(result.message || 'Registration failed.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again later.');
    }
});
///////////////////




///////////THIS IS FOR BILLING PAGE//////////////////////////////



///////////////////////

