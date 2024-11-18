document.addEventListener("DOMContentLoaded", () => {
    const patientsTable = document.getElementById("patients-table").querySelector("tbody");

    // Fetch all patients and populate the table
    async function fetchPatients() {
        try {
            const response = await fetch("/api/getPatients");
            if (!response.ok) throw new Error("Failed to fetch patients.");
            const patients = await response.json();

            // Populate table
            patientsTable.innerHTML = ""; // Clear table before populating
            patients.forEach((patient) => {
                const row = document.createElement("tr");
                row.setAttribute("data-patient-id", patient.patient_id);
                row.innerHTML = `
                    <td>${patient.first_name}</td>
                    <td>${patient.last_name}</td>
                    <td>${patient.date_of_birth}</td>
                    <td>${patient.phone_number}</td>
                    <td><button onclick="showMedicine(${patient.patient_id})" class="medicine-btn">Medicine</button></td>
                    <td><button onclick="showAppointments(${patient.patient_id})" class="appointments-btn">Appointments</button></td>
                    <td>
                        <button onclick="editPatient(${patient.patient_id})" class="edit-btn">Edit</button>
                        <button onclick="deletePatient(${patient.patient_id})" class="delete-btn">Delete</button>
                    </td>
                `;
                patientsTable.appendChild(row);
            });
        } catch (error) {
            console.error(error);
        }
    }

    // Delete a patient
    async function deletePatient(patientId) {
        try {
            const response = await fetch(`/api/patients/${patientId}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete patient.");
            alert("Patient deleted successfully.");
            fetchPatients(); // Refresh table
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting the patient.");
        }
    }

    // Show appointments for a patient
    async function showAppointments(patientId) {
        try {
            const response = await fetch(`/api/appointments/${patientId}`);
            if (!response.ok) throw new Error("Failed to fetch appointments.");
            const appointments = await response.json();
            console.log("Appointments:", appointments); // Replace with modal or UI logic
        } catch (error) {
            console.error(error);
        }
    }

    // Show medications for a patient
    async function showMedicine(patientId) {
        try {
            const response = await fetch(`/api/medications/${patientId}`);
            if (!response.ok) throw new Error("Failed to fetch medications.");
            const medications = await response.json();
            console.log("Medications:", medications); // Replace with modal or UI logic
        } catch (error) {
            console.error(error);
        }
    }

    // Edit patient (placeholder)
    function editPatient(patientId) {
        alert(`Edit functionality for Patient ID ${patientId} is under development.`);
    }

    // Fetch patients on page load
    fetchPatients();

    // Export delete function to global scope for onclick buttons
    window.deletePatient = deletePatient;
    window.showAppointments = showAppointments;
    window.showMedicine = showMedicine;
    window.editPatient = editPatient;
});
