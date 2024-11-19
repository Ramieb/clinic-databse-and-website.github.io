// editData.js
let currentEditId = null;

function editItem(id) {
    currentEditId = id;
    fetch(`/api/data-endpoint/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('name').value = data.name;
            document.getElementById('description').value = data.description;
        });
}

document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    try {
        const method = currentEditId ? 'PUT' : 'POST';
        const endpoint = currentEditId ? `/api/edit-endpoint/${currentEditId}` : '/api/add-endpoint';

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        });

        if (response.ok) {
            fetchData(); // Refresh the data displayed
            document.getElementById('addForm').reset(); // Clear form
            currentEditId = null; // Reset edit ID
        } else {
            console.error('Error saving data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
