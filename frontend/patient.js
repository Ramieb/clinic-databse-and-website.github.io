document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (username) {
        // Update Medical History link to include username in the URL
        const medicalHistoryLink = document.querySelector('.nav-link[href="#med-history"]');
        if (medicalHistoryLink) {
            medicalHistoryLink.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = `medical_history.html?username=${username}`;
            });
        } else {
            console.error("Medical History link not found.");
        }

        // Load other patient data after setting up navigation
        loadUpcomingAppointments(username);
        loadBillingInfo(username);
        loadPaymentInfo(username);
        loadReferrals(username);
        loadMedications(username);
        loadAllergies(username);
        loadIllnesses(username);
        loadSurgeries(username);
        loadImmunizations(username);
        loadMedicalHistory(username);
    } else {
        console.error("No username provided in URL");
        document.getElementById('appointmentContent').innerHTML = 'Username is missing from the URL.';
        return;
    }

    // Logout functionality
    const logoutLink = document.querySelector('.nav-link[href="#logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '../index.html';
        });
    } else {
        console.error("Logout link not found.");
    }
});

function handleFetchResponse(response, containerId, emptyMessage) {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json().then(data => {
        let content = '';
        data.forEach(item => {
            for (const [key, value] of Object.entries(item)) {
                content += `<p>${key.replace(/_/g, ' ')}: ${value}</p>`;
            }
            content += `<hr>`;
        });
        document.getElementById(containerId).innerHTML = content || emptyMessage;
    }).catch(error => {
        console.error(`Error loading ${containerId.replace('Content', '')}:`, error);
        document.getElementById(containerId).innerHTML = `Error loading ${containerId.replace('Content', '').toLowerCase()}.`;
    });
}

// Load upcoming appointments
function loadUpcomingAppointments(username) {
    fetch(`/api/patient/appointments/${username}`)
        .then(response => handleFetchResponse(response, 'appointmentContent', 'No upcoming appointments found.'));
}

// Load billing information
function loadBillingInfo(username) {
    fetch(`/api/patient/billing/${username}`)
        .then(response => handleFetchResponse(response, 'billingContent', 'No billing information found.'));
}

// Load payment information and show "Pay Here" button if payment is due
function loadPaymentInfo(username) {
    fetch(`/api/patient/payments/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            let paymentDue = false;
            data.forEach(payment => {
                content += `<p>Total Paid: $${payment.total_paid}</p>`;
                content += `<p>Pay Date: ${payment.pay_date}</p>`;
                content += `<p>Pay Towards: ${payment.pay_towards}</p>`;
                content += `<hr>`;
                if (!payment.paid) paymentDue = true;
            });
            document.getElementById('paymentContent').innerHTML = content || 'No payment records found.';
            
            const payHereButton = document.getElementById('payHereButton');
            if (paymentDue && payHereButton) {
                payHereButton.classList.add('active');
                payHereButton.addEventListener('click', () => {
                    alert('Payment processing...');
                });
            }
        })
        .catch(error => {
            console.error('Error loading payment information:', error);
            document.getElementById('paymentContent').innerHTML = 'Error loading payment information.';
        });
}

// Load referrals
function loadReferrals(username) {
    fetch(`/api/patient/referrals/${username}`)
        .then(response => handleFetchResponse(response, 'referralContent', 'No referrals found.'));
}

// Load medications
function loadMedications(username) {
    fetch(`/api/patient/medications/${username}`)
        .then(response => handleFetchResponse(response, 'medicationContent', 'No medications found.'));
}

// Load allergies
function loadAllergies(username) {
    fetch(`/api/patient/allergies/${username}`)
        .then(response => handleFetchResponse(response, 'allergyContent', 'No allergies found.'));
}

// Load illnesses
function loadIllnesses(username) {
    fetch(`/api/patient/illnesses/${username}`)
        .then(response => handleFetchResponse(response, 'illnessContent', 'No illnesses found.'));
}

// Load surgeries
function loadSurgeries(username) {
    fetch(`/api/patient/surgeries/${username}`)
        .then(response => handleFetchResponse(response, 'surgeryContent', 'No surgeries found.'));
}

// Load immunizations
function loadImmunizations(username) {
    fetch(`/api/patient/immunizations/${username}`)
        .then(response => handleFetchResponse(response, 'immunizationContent', 'No immunizations found.'));
}

// Load medical history
function loadMedicalHistory(username) {
    fetch(`/api/patient/medicalHistory/${username}`)
        .then(response => handleFetchResponse(response, 'medicalHistoryContent', 'No medical history found.'));
}
