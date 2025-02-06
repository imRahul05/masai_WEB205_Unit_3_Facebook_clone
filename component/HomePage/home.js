// Fetch posts container
let postsContainer = document.querySelector(".posts");
let postContentInput = document.getElementById("postContent");

// Fetch posts from Firebase
async function fetchingPosts() {
    let response = await fetch("https://facebook-ce39f-default-rtdb.firebaseio.com/posts.json");
    let res = await response.json();
    console.log(res);
    let posts = res ? Object.entries(res).map(([id, data]) => ({ id, ...data })) : [];
    displayPosts(posts);
}

// Display posts dynamically
// Display posts dynamically
function displayPosts(posts) {
    postsContainer.innerHTML = ""; // Clear existing posts
    posts.forEach(post => {
        let postElement = document.createElement("div");
        postElement.classList.add("post");

        let currentUser = "user123"; // Replace with actual logged-in user ID
        let isLiked = post.likedUsers && post.likedUsers.includes(currentUser);

        postElement.innerHTML = `
            <div class="post-header">
                <img src="${post.profile_pic}" alt="${post.username}" class="profile-pic">
                <div>
                    <h4>${post.username}</h4>
                    <p>${new Date(post.timestamp).toLocaleString()}</p>
                </div>
                <div class="posts-options">
                    <i class="fa-solid fa-ellipsis-vertical"></i> <!-- Three dots -->
                </div>
            </div>
            <div class="post-content">
                <p>${post.content}</p>
                ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ""}
            </div>
            <div class="post-footer">
                <div class="likes ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                    <i class="fa-solid fa-thumbs-up"></i> ${post.likes} Likes
                </div>
                <div class="comments" data-post-id="${post.id}">
                    <i class="fa-solid fa-comment"></i> ${post.comments.length} Comments
                </div>
            </div>
        `;

        postsContainer.appendChild(postElement);
    });

    // Attach click event listeners for likes and comments
    const likeButtons = document.querySelectorAll('.likes');
    likeButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            let postId = e.target.closest('.likes').dataset.postId;
            await updateLikes(postId);
        });
    });

    const commentButtons = document.querySelectorAll('.comments');
    commentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            let postId = e.target.closest('.comments').dataset.postId;
            openCommentPopup(postId);
        });
    });
}

let postPopup = document.getElementById("post-popup");
let postText = document.getElementById("postText");
let postImage = document.getElementById("postImage");
let postButton = document.getElementById("postButton");
let closePopup = document.getElementById("closePopup");
let photo=document.getElementById("poto");

// Show popup when clicking the input field
document.querySelector(".input-section input").addEventListener("click", () => {
    postPopup.style.display = "block";
});
photo.addEventListener("click",()=>{
    postPopup.style.display = "block";

})
// Close popup
closePopup.addEventListener("click", () => {
    postPopup.style.display = "none";
});

// Upload image and get URL
async function uploadImage(file) {
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Submit Post
postButton.addEventListener("click", async () => {
    let content = postText.value.trim();
    let imageFile = postImage.files[0];

    if (!content && !imageFile) {
        alert("Post cannot be empty!");
        return;
    }

    let imageUrl = imageFile ? await uploadImage(imageFile) : null;

    // Fetch existing posts to determine the new post ID
    let response = await fetch("https://facebook-ce39f-default-rtdb.firebaseio.com/posts.json");
    let posts = await response.json();
    
    let newPostId = posts ? Object.keys(posts).length+1 : 1; // Assign ID based on count

    let newPost = {
        id: newPostId, // Assign calculated ID
        username: "John Doe", // Replace with actual user data
        profile_pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s", // Replace with actual profile pic
        content: content,
        image: imageUrl,
        timestamp: new Date().toISOString(),
        likes:0,
        comments: ["none"]
    };

    // Store new post using the assigned numeric ID
    await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${newPostId-1}.json`, {
        method: "PUT", // Use PUT to store it under the specific ID
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
    });

    // Close popup and refresh posts
    postPopup.style.display = "none";
    postText.value = "";
    postImage.value = "";
    fetchingPosts();
});


async function updateLikes(postId) {
    let response = await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId-1}.json`);
    let post = await response.json();

    // Check if the user has already liked the post
    if (!post.likedUsers) {
        post.likedUsers = [];
    }
    
    let currentUser = "user123"; // Replace with actual user ID or session user
    if (!post.likedUsers.includes(currentUser)) {
        post.likes += 1; // Increment the like count
        post.likedUsers.push(currentUser); // Add user to liked list
    } else {
        post.likes -= 1; // Decrement the like count
        post.likedUsers = post.likedUsers.filter(user => user !== currentUser);
    }

    // Update the Firebase database
    await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId-1}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    });

    // Update the frontend
    fetchingPosts();
}


// Open Comment Popup
// Open Comment Popup
// Open Comment Popup
async function openCommentPopup(postId) {
    // Fetch post details to get existing comments
    let response = await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId-1}.json`);
    let post = await response.json();

    // Create the popup structure
    let popup = document.createElement('div');
    popup.classList.add('comment-popup');
    popup.innerHTML = `
        <div class="popup-content">
            <h3>Comments</h3>
            <div class="existing-comments">
                ${post.comments && post.comments.length > 0 
                    ? post.comments.filter(comment => comment !== "none").map(comment => `
                        <div class="comment">
                            <strong>${comment.username}</strong>: ${comment.content}
                        </div>
                    `).join('') 
                    : '<p>No comments yet.</p>'
                }
            </div>
            <textarea id="commentText" placeholder="Write your comment here..."></textarea>
            <button class="submit-comment">Submit</button>
            <button class="close-popup">Close</button>
        </div>
    `;

    // Append the popup to the body
    document.body.appendChild(popup);

    // Handle close button click
    popup.querySelector('.close-popup').addEventListener('click', () => {
        document.body.removeChild(popup); // Remove the popup
    });

    // Handle submit comment button click
    popup.querySelector('.submit-comment').addEventListener('click', async () => {
        let commentText = popup.querySelector('#commentText').value;

        if (commentText.trim()) {
            await addComment(postId, commentText); // Add the comment to Firebase
            document.body.removeChild(popup); // Close the popup
        }
    });
}



// Add Comment to Firebase
// Add Comment to Firebase
// Add Comment to Firebase
async function addComment(postId, commentText) {
    let response = await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId-1}.json`);
    let post = await response.json();

    // Get username or set default value
    let username = post.username;  // You can replace this with actual username if available

    // Add new comment as an object with username and text
    if (!post.comments) {
        post.comments = [];
    }
    post.comments.push({ username: username, content: commentText }); // Add the new comment

    // Update the Firebase database
    await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId-1}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(post)
    });

    // Re-fetch posts to update the comments count and the comment list
    fetchingPosts();
}



// Initial fetch to display posts
fetchingPosts();
