// memories.js

// Example of dynamically adding a memory (in real scenario, data could come from an API)
function loadMemories() {
    const memoryFeed = document.querySelector('.memories-feed');

    // Example memory data (in real app, this would come from a server)
    const memories = [
        {
            user: "John Doe",
            content: "This is a memory from my trip to the mountains!",
            image: "https://via.placeholder.com/600",
            likes: 25,
            comments: 5
        },
        {
            user: "Jane Smith",
            content: "Remembering the good times with friends!",
            image: "https://via.placeholder.com/600",
            likes: 30,
            comments: 10
        }
    ];

    memories.forEach(memory => {
        const memoryCard = document.createElement('div');
        memoryCard.classList.add('memory-card');
        memoryCard.innerHTML = `
            <div class="memory-header">
                <img src="https://via.placeholder.com/50" alt="User" class="memory-avatar">
                <p class="memory-user">${memory.user}</p>
            </div>
            <div class="memory-content">
                <p>${memory.content}</p>
                <img src="${memory.image}" alt="Memory Image" class="memory-image">
            </div>
            <div class="memory-footer">
                <span><i class="fa-solid fa-heart"></i> ${memory.likes} Likes</span>
                <span><i class="fa-solid fa-comment"></i> ${memory.comments} Comments</span>
            </div>
        `;

        memoryFeed.appendChild(memoryCard);
    });
}

// Load memories when the page is ready
document.addEventListener('DOMContentLoaded', loadMemories);
