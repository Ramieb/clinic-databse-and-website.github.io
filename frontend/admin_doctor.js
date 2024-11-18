document.addEventListener('DOMContentLoaded', () => {
    const doctorId = sessionStorage.getItem('doctorId') || '1';

    // Load initial doctor data
    fetchDoctorData(doctorId);


async function fetchDoctorData(doctorId) {
    try {
        const response = await fetch('/api/doctor/getDoctors');
        const doctors = await response.json();
        const tableBody = document.getElementById('doctors-table').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        
        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.dataset.doctorId = doctor.id; // Store doctor ID for front-end-only deletion
            
            row.innerHTML = `
                <td>${doctor.first_name || 'N/A'}</td>
                <td>${doctor.last_name || 'N/A'}</td>
                <td>${doctor.specialty}</td>
                <td>${doctor.office_Id || 'N/A'}</td>
                <td>
                    <button onclick="editDoctor(${doctor.id})" class="edit-btn">Edit</button>
                    <button onclick="deleteDoctor(${doctor.id})" class="delete-btn">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading doctors:", error);
    }
}
});
