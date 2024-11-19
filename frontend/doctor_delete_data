// deleteData.js
async function deleteItem(id) {
    try {
        const response = await fetch(`/api/delete-endpoint/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchData(); // Refresh the data displayed
        } else {
            console.error('Error deleting data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
