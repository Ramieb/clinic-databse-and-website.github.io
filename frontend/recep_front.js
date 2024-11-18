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
        
        
    } catch (error) {
        console.error('Error fetching office locations:', error);
    }
}

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
function paybill(patient_id, charge_date) {
    // You can add functionality to edit an appointment here
    alert('Editing payment for Patient ID: ' + patient_id + " for charge on " + charge_date);
    // For example, you might redirect to an edit page or open a modal to edit the details
    // window.location.href = `/edit-appointment/${patientId}`;
}

async function submitPatientID(){
    const patientID = document.getElementById("lookup_id").value;

    if (!patientID) {
        alert('Please enter patient ID before entering');
        return;
    }

    // Prepare data to send to the backend
    const formData = {
        patient_id: patientID,
    };

    try {
        // Send the data to the backend to get available appointments
        const response = await fetch('/api/billing_id_lookup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log(data);

        const resultsContainer = document.getElementById('billing_output');
        resultsContainer.innerHTML = ''; // Clear the previous content

        // If no data is returned, show a message
        if (data.length === 0) {
            resultsContainer.innerHTML = `<h2>No outstanding bills found for patient ID: ${patientID}</h2>`;
        } else {
            // Handle the response (loop through the data)
            resultsContainer.innerHTML = `
                <h2>All Outstanding Bills</h2>
                <ul>
                    ${data.map(bill => `
                        <li>
                            Patient ID: ${bill.patient_id} ${bill.first_name} ${bill.last_name}, 
                            Charge For: ${bill.charge_for}, 
                            Total Charged: ${bill.total_charged}, 
                            Total Paid: ${bill.total_paid}, 
                            Charge Date: ${bill.charge_date}

                            <button class="payment_button" onclick="payBill('${bill.patient_id}', '${bill.charge_date}')">Make a Payment</button>
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('billing_output').innerHTML = `<h2>Error checking bills. Please try again later.</h2>`;
    }
}

async function submitPatientAlt(){
    const patient_last_name = document.getElementById("last_name_bill").value;
    const patientDOB = document.getElementById("dob_bill").value;

    if (!patient_last_name || !patientDOB) {
        alert('Please enter both last name and DOB');
        return;
    }

    // Prepare data to send to the backend
    const formData = {
        patient_lastName: patient_last_name,
        patientDateOfBirth: patientDOB
    };

    try {
        // Send the data to the backend to get available appointments
        const response = await fetch('/api/billing_alt_lookup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log(data);

        const resultsContainer = document.getElementById('billing_output');
        resultsContainer.innerHTML = ''; // Clear the previous content

        // If no data is returned, show a message
        if (data.length === 0) {
            resultsContainer.innerHTML = `<h2>No outstanding bills found for patient: ${patient_last_name} with DOB: ${patientDOB}</h2>`;
        } else {
            // Handle the response (loop through the data)
            resultsContainer.innerHTML = `
                <h2>All Outstanding Bills</h2>
                <ul>
                    ${data.map(bill => `
                        <li>
                            Patient ID: ${bill.patient_id} ${bill.first_name} ${bill.last_name}, 
                            Charge For: ${bill.charge_for}, 
                            Total Charged: ${bill.total_charged}, 
                            Total Paid: ${bill.total_paid}, 
                            Charge Date: ${bill.charge_date}

                            <button class="payment_button" onclick="payBill('${bill.patient_id}', '${bill.charge_date}')">Make a Payment</button>
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('billing_output').innerHTML = `<h2>Error checking bills. Please try again later.</h2>`;
    }

}
document.getElementById('find_patient_id').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default action (form submission)
    
    submitPatientID();  // Call the submitForm function
});
document.getElementById('find_patient_alt').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default action (form submission)
    
    submitPatientAlt();  // Call the submitForm function
});
///////////////////////



///possible update to appointment filtering
/* <label for="choose_doc">Filter by Doctor:</label>
                <select id="choose_doc" name="choose_doc">
                    <option value="" disabled selected>Select Doctor</option>
                <button id="search_doc" onclick="populateDoctors(${appt.employee_ssn})">Search</button> */