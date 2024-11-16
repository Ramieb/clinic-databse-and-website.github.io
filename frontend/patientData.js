document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display patient data
    fetchPatientData();

    // Event listener for logout button
    document.getElementById('logoutButton').addEventListener('click', () => {
        window.location.href = '../index.html';
    });
});

async function fetchPatientData() {
    try {
        const response = await fetch('/patientActions/patients'); // Change to the correct endpoint for patients
        const patients = await response.json();
        const tableBody = document.getElementById('doctors-table').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        
        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.dataset.patientId = patient.id; // Store patient ID for front-end-only deletion
            
            row.innerHTML = `
                <td>${patient.firstName}</td>
                <td>${patient.lastName}</td>
                <td>${patient.accountCreationDate}</td>
                <td>
                    <button onclick="showMedicine(${patient.id})" class="medicine-btn">Medicine</button>
                </td>
                <td>
                    <button onclick="showAppointments(${patient.id})" class="appointments-btn">Past Appointments</button>
                </td>
                <td>
                    <button onclick="editPatient(this)" class="edit-btn">Edit</button>
                    <button onclick="deletePatient(this)" class="delete-btn">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading patients:", error);
    }
}

async function showAppointments(patientId) {
    // Fetch and display appointments for the selected patient
    try {
        const response = await fetch(`/patientActions/appointments/${patientId}`);
        const appointments = await response.json();
        const tableBody = document.getElementById('appointments-table').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.reason}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading appointments:", error);
    }
}

async function showMedicine(patientId) {
    // Fetch and display medicine data for the selected patient
    try {
        const response = await fetch(`/patientActions/medicine/${patientId}`);
        const medicines = await response.json();
        const tableBody = document.getElementById('medicine-table').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        medicines.forEach(medicine => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${medicine.name}</td>
                <td>${medicine.dosage}</td>
                <td>${medicine.timeOfDay}</td>
                <td>${medicine.endDate}</td>
            `;
            tableBody.appendChild(row);
        });
        
        document.getElementById('medicine-table').style.display = 'table'; // Show medicine table
    } catch (error) {
        console.error("Error fetching medicine data:", error);
    }
}

// Function to edit patient information
function editPatient(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');
    const isEditing = row.classList.contains('editing');
    
    if (isEditing) {
        // Save the edited values back to the table
        cells.forEach(cell => {
            const input = cell.querySelector('input');
            if (input) {
                cell.textContent = input.value; // Save the new value
            }
        });

        // Change button back to "Edit" and remove the editing class
        button.textContent = 'Edit';
        row.classList.remove('editing');
    } else {
        // Turn the cells into input fields for editing
        cells.forEach((cell, index) => {
            if (index !== 3 && index !== 4) { // Don't edit the buttons columns
                const fieldValue = cell.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = fieldValue;
                cell.textContent = ''; // Clear the cell
                cell.appendChild(input); // Add input to the cell
            }
        });

        // Change button to "Save" and add the editing class
        button.textContent = 'Save';
        row.classList.add('editing');
    }
}

// Function to delete a patient (soft delete)
function deletePatient(button) {
    const row = button.closest('tr');
    row.style.display = 'none';  // Hide the row from the table without affecting the database
    console.log(`Soft-deleted patient with ID: ${row.dataset.patientId}`);
}