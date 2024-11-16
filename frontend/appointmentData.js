// Fetch appointments from the database and populate the table dynamically
function fetchAppointments() {
    fetch('http://127.0.0.1:8080/api/appointments')  // Replace with your actual endpoint
        .then(response => response.json())
        .then(data => {
            const appointmentTableBody = document.querySelector('#doctors-table tbody');
            appointmentTableBody.innerHTML = '';  // Clear the table

            data.forEach(appointment => {
                const row = document.createElement('tr');
                row.setAttribute('data-id', appointment.id); // Set a unique identifier (e.g., ID from the database)
                row.innerHTML = `
                    <td>${appointment.date}</td>
                    <td>${appointment.time}</td>
                    <td>${appointment.patient_first_name}</td>
                    <td>${appointment.patient_last_name}</td>
                    <td>${appointment.doctor_name}</td>
                    <td>${appointment.reason_for_visit}</td>
                    <td>
                        <button class="edit-btn" onclick="editRow(this)">Edit</button>
                        <button class="delete-btn" onclick="softDeleteRow(this)">Delete</button>
                    </td>
                `;
                appointmentTableBody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Error fetching appointments:', err);
        });
}

// Function to edit the row
function editRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    // Toggle the contenteditable attribute for each cell in the row
    cells.forEach(cell => {
        if (cell !== cells[cells.length - 1]) { // Don't make the action buttons editable
            cell.setAttribute('contenteditable', 'true');
        }
    });

    // Change the Edit button to a Save button
    button.textContent = 'Save';
    button.setAttribute('onclick', 'saveRow(this)');
}

// Function to save the edited row
function saveRow(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');

    // Disable editing by removing contenteditable
    cells.forEach(cell => {
        cell.removeAttribute('contenteditable');
    });

    // Change the Save button back to Edit
    button.textContent = 'Edit';
    button.setAttribute('onclick', 'editRow(this)');

    // Optionally, save the changes to the database here (e.g., via an AJAX request)
    const updatedData = {
        id: row.getAttribute('data-id'),
        date: cells[0].textContent,
        time: cells[1].textContent,
        patient_first_name: cells[2].textContent,
        patient_last_name: cells[3].textContent,
        doctor_name: cells[4].textContent,
        reason_for_visit: cells[5].textContent
    };

    fetch('http://127.0.0.1:8080/api/appointments/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Appointment updated:', data);
    })
    .catch(err => {
        console.error('Error updating appointment:', err);
    });
}

// Function to soft delete the row (remove from table and update in database)
function softDeleteRow(button) {
    const row = button.closest('tr');
    const rowId = row.getAttribute('data-id'); // Get unique identifier of the row (e.g., ID from the database)

    // Remove the row from the table visually
    row.remove();

    // Send a request to the server to mark the record as deleted (soft delete)
    fetch('http://127.0.0.1:8080/api/appointments/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: rowId,  // Pass the ID of the row to mark as deleted
            deleted: true  // Mark it as deleted (could also be a timestamp like 'deleted_at')
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Soft delete successful', data);
    })
    .catch(error => {
        console.error('Error during soft delete:', error);
    });
}

// Call fetchAppointments on page load to populate the table
document.addEventListener('DOMContentLoaded', fetchAppointments);