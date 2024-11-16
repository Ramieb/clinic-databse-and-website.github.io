document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addDoctorForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Form not found!');
    }
});

async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target; // The form element
    const submitButton = form.querySelector('button[type="submit"]');

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const phoneNumber = document.getElementById('phone-number').value.trim();
    const ssn = document.getElementById('ssn').value.trim();
    const specialty = document.getElementById('specialty').value.trim();
    const officeId = document.getElementById('office-id').value.trim();

    // Client-side Validation
    if (!firstName || !lastName || !phoneNumber || !ssn || !specialty || !officeId) {
        alert('Please fill in all fields.');
        return;
    }

    if (!/^\d{3}-\d{3}-\d{4}$/.test(phoneNumber)) {
        alert('Phone number must be in the format ###-###-####');
        return;
    }

    if (!/^\d{3}-\d{2}-\d{4}$/.test(ssn)) {
        alert('SSN must be in the format ###-##-####');
        return;
    }

    const doctorData = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        ssn: ssn,
        specialty: specialty,
        office_id: officeId
    };

    try {
        // Disable submit button to prevent multiple submissions
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const response = await fetch('/doctorActions/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(doctorData)
        });

        if (response.ok) {
            alert('Doctor added successfully');
            console.log('Doctor added successfully');
            form.reset(); // Reset the form
            showSuccessMessage(); // Display success message
        } else {
            const errorData = await response.json();
            console.error('Error adding doctor:', errorData.message || response.statusText);
            alert(`Failed to add doctor: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add doctor');
    } finally {
        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}

// Function to display a success message
function showSuccessMessage() {
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Input successfully';
    successMessage.style.color = 'green';
    successMessage.style.fontWeight = 'bold';
    successMessage.style.marginTop = '20px';

    const form = document.getElementById('addDoctorForm');
    form.parentElement.appendChild(successMessage);

    // Remove the message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}