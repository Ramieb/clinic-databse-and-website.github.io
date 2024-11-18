document.addEventListener('DOMContentLoaded', () => {
    // Fetch doctor data and populate the table
    fetchDoctorData();

    // Function to fetch doctor data
    async function fetchDoctorData() {
        try {
            const response = await fetch('/api/doctor/getDoctors');
            const doctors = await response.json();
            const tableBody = document.getElementById('doctors-table').querySelector('tbody');
            tableBody.innerHTML = ''; // Clear existing rows

            doctors.forEach(doctor => {
                const row = document.createElement('tr');
                row.dataset.doctorId = doctor.id; // Store doctor ID for editing

                // Table cells with editable fields and buttons
                row.innerHTML = `
                    <td><span class="first-name">${doctor.first_name}</span><input type="text" class="edit-input first-name" value="${doctor.first_name}" style="display:none;"></td>
                    <td><span class="last-name">${doctor.last_name}</span><input type="text" class="edit-input last-name" value="${doctor.last_name}" style="display:none;"></td>
                    <td><span class="specialty">${doctor.specialty}</span><input type="text" class="edit-input specialty" value="${doctor.specialty}" style="display:none;"></td>
                    <td><span class="office-id">${doctor.office_id}</span><input type="text" class="edit-input office-id" value="${doctor.office_id}" style="display:none;"></td>
                    <td>
                        <button class="edit-btn" onclick="editDoctor(${doctor.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteDoctor(${doctor.id})">Delete</button>
                        <button class="save-btn" onclick="saveDoctor(${doctor.id})" style="display:none;">Save</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error loading doctor data:", error);
        }
    }

    // Edit doctor row
    window.editDoctor = (doctorId) => {
        const row = document.querySelector(`[data-doctor-id="${doctorId}"]`);
        row.querySelectorAll('.edit-input').forEach(input => {
            input.style.display = 'inline';
        });
        row.querySelectorAll('span').forEach(span => {
            span.style.display = 'none';
        });
        row.querySelector('.edit-btn').style.display = 'none';
        row.querySelector('.save-btn').style.display = 'inline';
    };

    // Save doctor changes
    window.saveDoctor = async (doctorId) => {
        const row = document.querySelector(`[data-doctor-id="${doctorId}"]`);
        const updatedDoctor = {
            first_name: row.querySelector('.first-name').value,
            last_name: row.querySelector('.last-name').value,
            specialty: row.querySelector('.specialty').value,
            office_id: row.querySelector('.office-id').value,
        };

        try {
            const response = await fetch(`/api/doctor/updateDoctor/${doctorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDoctor),
            });

            if (response.ok) {
                // Update the table with the new data
                row.querySelector('.first-name').innerText = updatedDoctor.first_name;
                row.querySelector('.last-name').innerText = updatedDoctor.last_name;
                row.querySelector('.specialty').innerText = updatedDoctor.specialty;
                row.querySelector('.office-id').innerText = updatedDoctor.office_id;

                // Hide input fields and show span elements
                row.querySelectorAll('.edit-input').forEach(input => {
                    input.style.display = 'none';
                });
                row.querySelectorAll('span').forEach(span => {
                    span.style.display = 'inline';
                });
                row.querySelector('.edit-btn').style.display = 'inline';
                row.querySelector('.save-btn').style.display = 'none';
            } else {
                console.error("Failed to update doctor");
            }
        } catch (error) {
            console.error("Error saving doctor:", error);
        }
    };

    // Soft delete doctor (hide from UI)
    window.deleteDoctor = (doctorId) => {
        const row = document.querySelector(`[data-doctor-id="${doctorId}"]`);
        row.style.display = 'none'; // Hides the row without deleting from the database
        // Optionally, you could also make a request to mark the doctor as deleted in the database
        // For example: fetch(`/api/doctor/softDelete/${doctorId}`, { method: 'DELETE' });
    };
});