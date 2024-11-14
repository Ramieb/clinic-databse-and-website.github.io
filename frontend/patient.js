document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (username) {
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

    // Event listener for logout link
    document.querySelector('.logout-link').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link behavior
        window.location.href = '../index.html'; // Redirects to the home or login page
    });
});

// Function to load upcoming appointments
function loadUpcomingAppointments(username) {
    fetch(`/api/patient/appointments/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(appointment => {
                content += `<p>Date: ${appointment.date}</p>`;
                content += `<p>Time: ${appointment.time}</p>`;
                content += `<p>Doctor: ${appointment.doctor}</p>`;
                content += `<p>Reason: ${appointment.reason}</p>`;
                content += `<hr>`;
            });
            document.getElementById('appointmentContent').innerHTML = content || 'No upcoming appointments found.';
        })
        .catch(error => {
            console.error('Error loading upcoming appointments:', error);
            document.getElementById('appointmentContent').innerHTML = 'Error loading upcoming appointments.';
        });
}

// Function to load billing information
function loadBillingInfo(username) {
    fetch(`/api/patient/billing/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(bill => {
                content += `<p>Charge For: ${bill.chargeFor}</p>`;
                content += `<p>Total Charge: $${bill.totalCharge}</p>`;
                content += `<p>Charge Date: ${bill.chargeDate}</p>`;
                content += `<p>Paid Off: ${bill.paidOff ? 'Yes' : 'No'}</p>`;
                content += `<hr>`;
            });
            document.getElementById('billingContent').innerHTML = content || 'No billing information found.';
        })
        .catch(error => {
            console.error('Error loading billing information:', error);
            document.getElementById('billingContent').innerHTML = 'Error loading billing information.';
        });
}

// Function to load payment information and show "Pay Here" button if payment is due
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
            
            // Enable "Pay Here" button if payment is due
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

// Function to load referrals
function loadReferrals(username) {
    fetch(`/api/patient/referrals/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(referral => {
                content += `<p>Primary Doctor: ${referral.primary_doc}</p>`;
                content += `<p>Specialist: ${referral.specialist}</p>`;
                content += `<p>Referral Date: ${referral.ref_date}</p>`;
                content += `<p>Expiration: ${referral.expiration}</p>`;
                content += `<hr>`;
            });
            document.getElementById('referralContent').innerHTML = content || 'No referrals found.';
        })
        .catch(error => {
            console.error('Error loading referrals:', error);
            document.getElementById('referralContent').innerHTML = 'Error loading referrals.';
        });
}

// Function to load medications
function loadMedications(username) {
    fetch(`/api/patient/medications/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(med => {
                content += `<p>Medicine: ${med.medicine}</p>`;
                content += `<p>Dosage: ${med.dosage}</p>`;
                content += `<p>Start Date: ${med.start_date}</p>`;
                content += `<p>End Date: ${med.end_date}</p>`;
                content += `<hr>`;
            });
            document.getElementById('medicationContent').innerHTML = content || 'No medications found.';
        })
        .catch(error => {
            console.error('Error loading medications:', error);
            document.getElementById('medicationContent').innerHTML = 'Error loading medications.';
        });
}

// Function to load allergies
function loadAllergies(username) {
    fetch(`/api/patient/allergies/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(allergy => {
                content += `<p>Allergy: ${allergy.allergy}</p>`;
                content += `<p>Start Date: ${allergy.start_date}</p>`;
                content += `<hr>`;
            });
            document.getElementById('allergyContent').innerHTML = content || 'No allergies found.';
        })
        .catch(error => {
            console.error('Error loading allergies:', error);
            document.getElementById('allergyContent').innerHTML = 'Error loading allergies.';
        });
}

// Function to load illnesses
function loadIllnesses(username) {
    fetch(`/api/patient/illnesses/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(illness => {
                content += `<p>Ailment: ${illness.ailment}</p>`;
                content += `<p>Start Date: ${illness.start_date}</p>`;
                content += `<hr>`;
            });
            document.getElementById('illnessContent').innerHTML = content || 'No illnesses found.';
        })
        .catch(error => {
            console.error('Error loading illnesses:', error);
            document.getElementById('illnessContent').innerHTML = 'Error loading illnesses.';
        });
}

// Function to load surgeries
function loadSurgeries(username) {
    fetch(`/api/patient/surgeries/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(surgery => {
                content += `<p>Procedure Done: ${surgery.procedure_done}</p>`;
                content += `<p>Body Part: ${surgery.body_part}</p>`;
                content += `<p>Surgery Date: ${surgery.surgery_date}</p>`;
                content += `<p>Cost: $${surgery.cost}</p>`;
                content += `<hr>`;
            });
            document.getElementById('surgeryContent').innerHTML = content || 'No surgeries found.';
        })
        .catch(error => {
            console.error('Error loading surgeries:', error);
            document.getElementById('surgeryContent').innerHTML = 'Error loading surgeries.';
        });
}

// Function to load immunizations
function loadImmunizations(username) {
    fetch(`/api/patient/immunizations/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(immunization => {
                content += `<p>Vaccine: ${immunization.vaccine}</p>`;
                content += `<p>Vaccine Date: ${immunization.vax_date}</p>`;
                content += `<p>Cost: $${immunization.cost}</p>`;
                content += `<hr>`;
            });
            document.getElementById('immunizationContent').innerHTML = content || 'No immunizations found.';
        })
        .catch(error => {
            console.error('Error loading immunizations:', error);
            document.getElementById('immunizationContent').innerHTML = 'Error loading immunizations.';
        });
}

// Function to load medical history
function loadMedicalHistory(username) {
    fetch(`/api/patient/medicalHistory/${username}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            let content = '';
            data.forEach(record => {
                content += `<p>Last Visit: ${record.last_visit}</p>`;
                content += `<p>Height: ${record.height} cm</p>`;
                content += `<p>Weight: ${record.weight} kg</p>`;
                content += `<p>Blood Pressure: ${record.blood_pressure}</p>`;
                content += `<hr>`;
            });
            document.getElementById('medicalHistoryContent').innerHTML = content || 'No medical history found.';
        })
        .catch(error => {
            console.error('Error loading medical history:', error);
            document.getElementById('medicalHistoryContent').innerHTML = 'Error loading medical history.';
        });
}
