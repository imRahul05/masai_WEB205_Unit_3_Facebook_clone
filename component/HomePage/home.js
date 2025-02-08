let postsContainer = document.querySelector(".posts");
let postContentInput = document.getElementById("postContent");
let currentUser=(JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser')) )|| "Guest"; 
let inputProfilePic = document.getElementById("input-profile");
if (currentUser.profilePic) {
    inputProfilePic.src = currentUser.profilePic;
}
document.addEventListener("DOMContentLoaded", function () {
    let username = document.getElementById("username");
    username.textContent=currentUser.firstName || "Guest";

});
document.addEventListener("click", (event) => {
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (!menu.parentElement.contains(event.target)) {
            menu.classList.add("hidden"); // Hide menu if clicked outside
        }
    });
});
// Fetch posts from Firebase
async function fetchingPosts() {
    let response = await fetch("https://facebook-ce39f-default-rtdb.firebaseio.com/posts.json");
    let res = await response.json();
    console.log(res);
    let posts = res ? Object.entries(res).map(([id, data]) => ({ id, ...data })) : [];
    displayPosts(posts);
}
function displayPosts(posts) {
    postsContainer.innerHTML = ""; 
    posts.forEach(post => {
        if (!post || !post.timestamp) {
            console.warn("Invalid post detected", post);
            return; 
        }
        let postElement = document.createElement("div");
        postElement.classList.add("post");
        
        let currentuser = currentUser.firstName||"Guest"; 
        let isLiked = post.likedUsers && post.likedUsers.includes(currentuser);

        postElement.innerHTML = `
            <div class="post-header">
                <img src="${post.profile_pic || "./navbar/Logo.webp"}" alt="${post.username || Guest}" class="profile-pic">
                <div>
                    <h4>${post.username || Guest}</h4>
                    <p>${new Date(post.timestamp).toLocaleString()}</p>
                </div>
                <div class="posts-options">
                    <i class="fa-solid fa-ellipsis-vertical"></i> <!-- Three dots -->
                    <div class="dropdown-menu hidden">
                        <button class="edit-post" data-post-id="${post.id}">Edit</button>
                        <button class="delete-post" data-post-id="${post.id}">Delete</button>
                    </div>
                </div>
            </div>
            <div class="post-content">
                <p>${post.content || ""}</p>
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
        let menuIcon = postElement.querySelector(".fa-ellipsis-vertical");
        let dropdownMenu = postElement.querySelector(".dropdown-menu");

        menuIcon.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent closing when clicking the menu icon
            dropdownMenu.classList.toggle("hidden");
        });

        // Handle Edit Post
        let editButton = postElement.querySelector(".edit-post");
        editButton.addEventListener("click", () => editPost(post));

        // Handle Delete Post
        let deleteButton = postElement.querySelector(".delete-post");
        deleteButton.addEventListener("click", () => deletePost(post.id));
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
document.addEventListener("DOMContentLoaded", function() {
    let postPopup = document.getElementById("post-popup");
    let postTrigger = document.querySelector(".input-section input");
    
    if (postTrigger) {
        postTrigger.addEventListener("click", () => {
            postPopup.style.display = "block";
        });
    } else {
        console.error("Popup trigger not found!");
    }
});

function editPost(post) {
    let newContent = prompt("Edit your post:", post.content);
    if (newContent !== null && newContent.trim() !== "") {
        fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${post.id - 1}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newContent }),
        }).then(() => fetchingPosts());
    }
}
function deletePost(postId) {
    let confirmDelete = confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
        fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId - 1}.json`, {
            method: "DELETE",
        }).then(() => fetchingPosts());
    }
}

let postPopup = document.getElementById("post-popup");
let postText = document.getElementById("postText");
let postImage = document.getElementById("postImage");
let postButton = document.getElementById("postButton");
let closePopup = document.getElementById("closePopup");
let photo=document.getElementById("poto");

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

    if (!content) {
        alert("Post cannot be empty!");
        return;
    }

    let imageUrl = imageFile ? await uploadImage(imageFile) : null;

    // Fetch existing posts to determine the new post ID
    let response = await fetch("https://facebook-ce39f-default-rtdb.firebaseio.com/posts.json");
    let posts = await response.json();
    
    let newPostId = posts ? Object.keys(posts).length+1 : 1; // Assign ID based on count
    console.log("profilepic",currentUser.profilePic)
    let newPost = {
        id: newPostId, // Assign calculated ID
        username:currentUser.firstName|| "Guest", // Replace with actual user data
        profile_pic: currentUser.profilePic, 
        content: content,
        image: imageUrl,
        timestamp: new Date().toISOString(),
        likes:0,
        comments: ["none"]
    };
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
    
    let currentuser = currentUser.firstName||"Guest"; 
    if (!post.likedUsers.includes(currentUser)) {
        post.likes += 1; // Increment the like count
        post.likedUsers.push(currentuser); 
    } else {
        post.likes -= 1; // Decrement the like count
        post.likedUsers = post.likedUsers.filter(user => user !== currentuser);
    }

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
async function openCommentPopup(postId) {
    let response = await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId-1}.json`);
    let post = await response.json();
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
    popup.querySelector('.close-popup').addEventListener('click', () => {
        document.body.removeChild(popup); // Remove the popup
    });

    popup.querySelector('.submit-comment').addEventListener('click', async () => {
        let commentText = popup.querySelector('#commentText').value;

        if (commentText.trim()) {
            await addComment(postId, commentText); // Add the comment to Firebase
            document.body.removeChild(popup); // Close the popup
        }
    });
}
async function addComment(postId, commentText) {
    let response = await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId-1}.json`);
    let post = await response.json();

    // Get username or set default value
    let username = currentUser.firstName||"Guest";  

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

    fetchingPosts();
}
document.addEventListener("DOMContentLoaded", function () {
    const createStoryBtn = document.querySelector(".create-story");
    const storyPopup = document.getElementById("story-popup");
    const storyImageInput = document.getElementById("storyImage");
    const storyPreview = document.getElementById("storyPreview");
    const postStoryButton = document.getElementById("postStoryButton");
    const closeStoryPopup = document.getElementById("closeStoryPopup");
    const storiesContainer = document.getElementById("stories-container");
    const storyModal = document.getElementById("story-modal");
    const closeModalButton = document.getElementById("close-modal");
    const storyModalMedia = document.getElementById("story-modal-media");


    const firebaseURL = "https://facebook-ce39f-default-rtdb.firebaseio.com/stories.json";

    // Open Story Popup
    createStoryBtn.addEventListener("click", () => {
        storyPopup.style.display = "block";
    });

    // Close Story Popup
    closeStoryPopup.addEventListener("click", () => {
        storyPopup.style.display = "none";
        storyImageInput.value = "";
        storyPreview.innerHTML = "";
        storyPreview.style.display = "none";
    });

    // Preview Story Before Posting
    storyImageInput.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                let previewElement;
                if (file.type.startsWith("image")) {
                    previewElement = `<img src="${e.target.result}" alt="Story Preview">`;
                } else if (file.type.startsWith("video")) {
                    previewElement = `<video src="${e.target.result}" controls></video>`;
                }
                storyPreview.innerHTML = previewElement;
                storyPreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    // Fetch Stories to Get Next ID
    function getNextStoryID(callback) {
        fetch(firebaseURL)
            .then(response => response.json())
            .then(data => {
                let nextID = 1; 
                if (data) {
                    const keys = Object.keys(data).map(Number); 
                    console.log(keys.length)
                    if (keys.length > 0) {
                        nextID = Math.max(...keys) + 1; // Get max ID and increment
                    }
                }
                callback(nextID);
            })
            .catch(() => callback(1)); // Default to 1 if error occurs
    }

    // Post Story to Firebase
    postStoryButton.addEventListener("click", function () {
        const file = storyImageInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                getNextStoryID((storyID) => {
                    const storyData = {
                        username:currentUser.firstName||"Guest", 
                        media: e.target.result, 
                        timestamp: Date.now()
                    };

                    // Store in Firebase using Numeric ID
                    fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/stories/${storyID}.json`, {
                        method: "PUT",
                        body: JSON.stringify(storyData),
                        headers: { "Content-Type": "application/json" }
                    }).then(() => {
                        displayStory(storyData); 
                        storyPopup.style.display = "none";
                        storyImageInput.value = "";
                        storyPreview.innerHTML = "";
                        storyPreview.style.display = "none";
                    });
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Fetch & Display Stories
    function loadStories() {
        fetch(firebaseURL)
            .then(response => response.json())
            .then(data => {
                storiesContainer.innerHTML = ""; 
                if (data) {
                    Object.keys(data).forEach(key => {
                        const story = data[key];
    
                        if (story && story.timestamp) { // Check if story is not null
                            if (Date.now() - story.timestamp < 86400000) { // 24 hours expiry
                                displayStory(story);
                            } else {
                                deleteStory(key);
                            }
                        } else {
                            console.warn(`Skipping null or invalid story for key: ${key}`);
                        }
                    });
                }
            })
            .catch(error => console.error("Error loading stories:", error));
    }
    

    // Display Story on UI
    function displayStory(story) {
        let storyElement = document.createElement("div");
        storyElement.classList.add("story");
        let mediaElement;

        if (story.media.startsWith("data:image")) {
            mediaElement = `<img src="${story.media}" alt="Story">`;
        } else if (story.media.startsWith("data:video")) {
            mediaElement = `<video src="${story.media}" autoplay loop></video>`;
        }

        storyElement.innerHTML = `${mediaElement}<p>${story.username}</p>`;
        storiesContainer.appendChild(storyElement);
    }
    function displayStory(story) {
        let storyElement = document.createElement("div");
        storyElement.classList.add("story");
        let mediaElement;

        if (story.media.startsWith("data:image")) {
            mediaElement = `<img src="${story.media}" alt="Story">`;
        } else if (story.media.startsWith("data:video")) {
            mediaElement = `<video src="${story.media}" autoplay loop></video>`;
        }

        storyElement.innerHTML = `${mediaElement}<p>${story.username}</p>`;

        // Add click event to open story modal
        storyElement.addEventListener("click", () => openStoryModal(story));

        storiesContainer.appendChild(storyElement);
    }
    function openStoryModal(story) {
        storyModal.style.display = "flex";
        storyModalMedia.innerHTML = "";
        let mediaElement;
        if (story.media.startsWith("data:image")) {
            mediaElement = `<img src="${story.media}" alt="Story">`;
        } else if (story.media.startsWith("data:video")) {
            mediaElement = `<video src="${story.media}" controls autoplay></video>`;
        }

        storyModalMedia.innerHTML = mediaElement;
    }

    // Close Modal (Popup)
    closeModalButton.addEventListener("click", () => {
        storyModal.style.display = "none";
        storyModalMedia.innerHTML = ""; 
    });

    // Delete Expired Story from Firebase
    function deleteStory(storyId) {
        fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/stories/${storyId}.json`, {
            method: "DELETE"
        });
    }

    // Load stories on page load
    loadStories();
});


fetchingPosts();
