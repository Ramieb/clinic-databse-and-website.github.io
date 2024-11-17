document.getElementById("search-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const patientId = document.getElementById("patient-id").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    const params = new URLSearchParams();
    if (patientId) params.append("patientId", patientId);
    if (firstName) params.append("firstName", firstName);
    if (lastName) params.append("lastName", lastName);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    try {
        // Fetch appointments from the server
        const response = await fetch(`/api/appointments?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch appointments.");

        const appointments = await response.json();
        displayAppointments(appointments);
    } catch (error) {
        console.error(error);
        alert("Error fetching appointments.");
    }
});

// Function to display appointments in the table
function displayAppointments(appointments) {
    const table = document.querySelector(".appointment-table tbody");
    table.innerHTML = ''; // Clear any previous results

    appointments.forEach(appointment => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${appointment.patient_name}</td>
            <td>${new Date(appointment.appointment_date).toLocaleDateString()}</td>
            <td>${appointment.doctor}</td>
            <td><button onclick="viewAppointmentDetails(${appointment.appointment_id})">View Details</button></td>
        `;
        table.appendChild(row);
    });
}

// Function to fetch and display appointment details
async function viewAppointmentDetails(appointmentId) {
    try {
        const response = await fetch(`/api/appointments/${appointmentId}`);
        if (!response.ok) throw new Error("Failed to fetch appointment details.");

        const appointment = await response.json();
        populateAppointmentDetails(appointment);
    } catch (error) {
        console.error(error);
        alert("Error fetching appointment details.");
    }
}

function populateAppointmentDetails(appointment) {
    document.getElementById("appointment-id").value = appointment.appointment_id;
    document.getElementById("weight").value = appointment.weight || '';
    document.getElementById("height").value = appointment.height || '';
    document.getElementById("blood-pressure").value = appointment.blood_pressure || '';
    document.getElementById("temperature").value = appointment.temperature || '';
    document.getElementById("doctor-notes").value = appointment.doctor_notes || '';

    document.getElementById("appointment-details").style.display = "block";
}

// Function to handle appointment updates
document.getElementById("update-appointment-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const appointmentId = document.getElementById("appointment-id").value;
    const weight = document.getElementById("weight").value;
    const height = document.getElementById("height").value;
    const bloodPressure = document.getElementById("blood-pressure").value;
    const temperature = document.getElementById("temperature").value;
    const doctorNotes = document.getElementById("doctor-notes").value;

    const updatedAppointment = {
        weight,
        height,
        bloodPressure,
        temperature,
        doctorNotes
    };

    try {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedAppointment)
        });
        if (!response.ok) throw new Error("Failed to update appointment.");

        const updatedData = await response.json();
        alert("Appointment updated successfully!");
        document.getElementById("appointment-details").style.display = "none";
    } catch (error) {
        console.error(error);
        alert("Error updating appointment.");
    }
});
