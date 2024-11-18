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

// Function to edit the row
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

    // Send updated data to the backend
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

// POST route to soft delete an appointment
app.post('/api/appointments/softDelete', (req, res) => {
    const { patient_id, app_date, app_start_time } = req.body;

    const query = `
        UPDATE Appointment
        SET deleted = TRUE  -- Assuming you have a 'deleted' column
        WHERE P_ID = ? AND app_date = ? AND app_start_time = ?
    `;
    
    db.query(query, [patient_id, app_date, app_start_time], (err, result) => {
        if (err) {
            console.error('Error performing soft delete:', err);
            return res.status(500).json({ success: false, message: 'Failed to delete appointment' });
        }

        res.status(200).json({ success: true, message: 'Appointment marked as deleted' });
    });
});


// Call fetchAppointments on page load to populate the table
document.addEventListener('DOMContentLoaded', fetchAppointments);