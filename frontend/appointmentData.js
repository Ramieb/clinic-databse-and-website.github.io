// Fetch appointments from the database and populate the table dynamically
function fetchAppointments() {
    fetch('/api/appointments/getAppointments')  // Use the correct endpoint
        .then(response => response.json())
        .then(data => {
            const appointmentTableBody = document.querySelector('#doctors-table tbody');
            appointmentTableBody.innerHTML = '';  // Clear the table before populating it

            data.forEach(appointment => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', appointment.patient_id); // Use patient_id as a unique identifier

                row.innerHTML = `
                    <td>${appointment.app_date}</td> <!-- Date -->
                    <td>${appointment.app_start_time} - ${appointment.app_end_time}</td> <!-- Time -->
                    <td>${appointment.patient_first_name}</td> <!-- Patient's First Name -->
                    <td>${appointment.patient_last_name}</td> <!-- Patient's Last Name -->
                    <td>${appointment.doctor_first_name} ${appointment.doctor_last_name}</td> <!-- Doctor's Full Name -->
                    <td>${appointment.reason_for_visit}</td> <!-- Reason for Visit -->
                    <td>
                        <button class="edit-btn" onclick="editRow(this)">Edit</button>
                        <button class="delete-btn" onclick="softDeleteRow(this)">Delete</button>
                    </td>
                `;
                
                // Append the new row to the table
                appointmentTableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Error fetching appointments:', err);
        });
}

// Function to edit the row (turn table cells into input fields)
function editRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    // Convert cells into editable inputs
    cells[0].innerHTML = `<input type="text" value="${cells[0].textContent.trim()}">`;  // Date
    cells[1].innerHTML = `<input type="text" value="${cells[1].textContent.trim()}">`;  // Time
    cells[2].innerHTML = `<input type="text" value="${cells[2].textContent.trim()}">`;  // Patient First Name
    cells[3].innerHTML = `<input type="text" value="${cells[3].textContent.trim()}">`;  // Patient Last Name
    cells[4].innerHTML = `<input type="text" value="${cells[4].textContent.trim()}">`;  // Doctor's Full Name
    cells[5].innerHTML = `<input type="text" value="${cells[5].textContent.trim()}">`;  // Reason for Visit

    // Change the edit button to a save button
    button.textContent = 'Save';
    button.setAttribute('onclick', 'saveRow(this, ' + row.getAttribute('data-id') + ')');
}

// Function to save the row (send updated data to the server)
function saveRow(button, patientId) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    // Collect the updated data from the input fields
    const app_date = cells[0].querySelector('input').value;
    const app_start_time = cells[1].querySelectorAll('input')[0].value;
    const app_end_time = cells[1].querySelectorAll('input')[1].value;
    const patient_first_name = cells[2].querySelector('input').value;
    const patient_last_name = cells[3].querySelector('input').value;
    const doctor_name = cells[4].querySelector('input').value;
    const reason_for_visit = cells[5].querySelector('input').value;

    // Send updated data to the backend (as you already have)
    fetch(`/api/appointments/updateAppointment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            patient_id: patientId,
            app_date: app_date,
            app_start_time: app_start_time,
            app_end_time: app_end_time,
            patient_first_name: patient_first_name,
            patient_last_name: patient_last_name,
            doctor_name: doctor_name,
            reason_for_visit: reason_for_visit,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Appointment updated successfully!');
            fetchAppointments();  // Refresh the table
        } else {
            alert('Failed to update appointment');
        }
    })
    .catch(err => {
        console.error('Error saving appointment:', err);
    });
}



// Function to soft delete an appointment (hide row)
function softDeleteRow(button) {
    const row = button.closest('tr');
    const patientId = row.getAttribute('data-id');
    const appDate = row.cells[0].textContent.trim();
    const appStartTime = row.cells[1].textContent.trim().split(' - ')[0]; // Assuming format "start - end"

    // Send request to backend to mark the appointment as deleted (via /admin route)
    fetch('/admin/softDelete', {  // Changed to /admin/softDelete
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            patient_id: patientId,
            app_date: appDate,
            app_start_time: appStartTime
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Appointment deleted successfully!');
            row.style.display = 'none';  // Hide the row visually
        } else {
            alert('Failed to delete appointment');
        }
    })
    .catch(err => {
        console.error('Error deleting appointment:', err);
    });
}

// Call fetchAppointments on page load to populate the table
document.addEventListener('DOMContentLoaded', fetchAppointments);