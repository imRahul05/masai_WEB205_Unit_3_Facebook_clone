// Sample data for testing (replace this with real data from a database or API)
const users = [
    { id: 1, name: "John Doe", imageUrl: "https://via.placeholder.com/60" },
    { id: 2, name: "Jane Smith", imageUrl: "https://via.placeholder.com/60" },
    { id: 3, name: "Alice Johnson", imageUrl: "https://via.placeholder.com/60" },
    { id: 4, name: "Bob Brown", imageUrl: "https://via.placeholder.com/60" }
];

// Search button click listener
document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = users.filter(user => user.name.toLowerCase().includes(query));

    displayResults(results);
});

// Function to display the search results
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';

    if (results.length > 0) {
        results.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('friend-result');

            userElement.innerHTML = `
                <img src="${user.imageUrl}" alt="${user.name}" class="friend-img">
                <div class="friend-info">
                    <p><strong>${user.name}</strong></p>
                </div>
                <button class="add-friend-btn" onclick="addFriend(${user.id})">Add Friend</button>
            `;
            
            resultsContainer.appendChild(userElement);
        });
    } else {
        resultsContainer.innerHTML = '<p>No users found.</p>';
    }
}

// Function to simulate adding a friend
function addFriend(userId) {
    alert(`Friend request sent to user with ID: ${userId}`);
}
