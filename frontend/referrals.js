document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');

    // Fetch referrals for the patient
    fetch(`/api/referrals/${username}`)
        .then(response => response.json())
        .then(data => {
            const pendingContainer = document.getElementById('pendingReferrals');
            const processedContainer = document.getElementById('processedReferrals');

            data.forEach(referral => {
                const div = document.createElement('div');
                div.textContent = `
                    Doctor: ${referral.doctor_first_name} ${referral.doctor_last_name}
                    Reason: ${referral.reason_for_referral}
                    Status: ${referral.doc_appr ? 'Approved' : referral.doc_appr === false ? 'Rejected' : 'Pending'}
                `;
                referral.doc_appr === null ? pendingContainer.appendChild(div) : processedContainer.appendChild(div);
            });
        })
        .catch(error => console.error('Error fetching referrals:', error));
});