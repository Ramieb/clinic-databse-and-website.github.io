
async function loadPatientInfo() {
    const patientId = document.getElementById('patient-id').value;

    if (!patientId) {
        alert('Please enter a patient ID');
        return;
    }

    try {
        const response = await fetch(`/get-patient-info/${patientId}`);
        
        if (!response.ok) {
            const data = await response.json();
            alert(data.error || 'Failed to load patient information');
            return;
        }

        const patientData = await response.json();

        document.getElementById('edit-first-name').value = patientData.first_name;
        document.getElementById('edit-last-name').value = patientData.last_name;
        document.getElementById('edit-dob').value = patientData.dob;
        document.getElementById('edit-age').value = patientData.age;
        document.getElementById('edit-gender').value = patientData.gender;
        document.getElementById('edit-current-illnesses').value = patientData.illnesses;
        document.getElementById('edit-surgical-history').value = patientData.surgical_history;
        document.getElementById('edit-immunizations').value = patientData.immunizations;
        document.getElementById('edit-medications').value = patientData.medications;
        document.getElementById('edit-allergies').value = patientData.allergies;

        document.getElementById('patient-details').style.display = 'block';
    } catch (error) {
        alert('Error fetching patient information');
        console.error(error);
    }
}

async function savePatientInfo() {
    const patientId = document.getElementById('patient-id').value;
    const first_name = document.getElementById('edit-first-name').value;
    const last_name = document.getElementById('edit-last-name').value;
    const dob = document.getElementById('edit-dob').value;
    const age = document.getElementById('edit-age').value;
    const gender = document.getElementById('edit-gender').value;
    const illnesses = document.getElementById('edit-current-illnesses').value;
    const surgicalHistory = document.getElementById('edit-surgical-history').value;
    const immunizations = document.getElementById('edit-immunizations').value;
    const medications = document.getElementById('edit-medications').value;
    const allergies = document.getElementById('edit-allergies').value;

    if (!name || !dob || !age || !gender) {
        alert('Please fill in all required fields');
        return;
    }

    const patientData = {
        patientId, first_name, last_name, dob, age, gender, illnesses, surgicalHistory, immunizations, medications, allergies
    };

    try {
        const response = await fetch('/update-patient-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Patient information updated successfully');
        } else {
            alert(data.error || 'Failed to update patient information');
        }
    } catch (error) {
        alert('Error saving patient information');
        console.error(error);
    }
}
