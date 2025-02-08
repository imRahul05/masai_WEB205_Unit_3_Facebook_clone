document.addEventListener("DOMContentLoaded", function() {
    fetchingPosts()
    console.log('hi')
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        console.log('hi')
        window.location.href = '../../index.html'; // Redirect to login if no user is logged in
        return;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.id === currentUser.id);

    if (user) {
        console.log('hi')
        document.getElementById('profileName').textContent = `${user.firstName} ${user.lastName}`;
        document.getElementById('bioText').textContent = user.bio || 'Add a bio';
        document.getElementById('locationText').textContent = user.location || 'Add location';
        document.getElementById('workText').textContent = user.work || 'Add work';
        document.getElementById('educationText').textContent = user.education || 'Add education';
        document.getElementById('profilePic').src = user.profilePic || 'default-profile-pic-url';
        document.getElementById('coverPhoto').src = user.coverPhoto || 'default-cover-photo-url';
        document.getElementById('postProfilePic').src = user.profilePic || 'default-profile-pic-url';
        
        // Initialize posts array in localStorage if it doesn't exist
        if (!localStorage.getItem('posts')) {
            localStorage.setItem('posts', JSON.stringify([]));
        }
        
        // Set globals for firebase functions
        window.currentUser = currentUser;
        window.postsContainer = document.getElementById('postsContainer');

        // Replace localStorage posts loading with Firebase posts fetching
        fetchingPosts();
    }
});

// Update loadUserPosts function to properly handle posts

function loadUserPosts(user) {
    const allPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const userPosts = allPosts.filter(post => post.userId === user.id);
    
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';
    
    // Sort posts by timestamp in descending order (newest first)
    userPosts.sort((a, b) => b.timestamp - a.timestamp);
    
    if (userPosts.length === 0) {
        postsContainer.innerHTML = '<div class="no-posts">No posts yet</div>';
        return;
    }
    
    userPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${user.profilePic || 'default-profile-pic-url'}" alt="Profile Picture" class="profile-pic">
                <div>
                    <h3>${user.firstName} ${user.lastName}</h3>
                    <p>${new Date(post.timestamp).toLocaleString()}</p>
                </div>
            </div>
            <div class="post-content">
                <p>${post.text}</p>
                ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
            </div>
            <div class="post-actions">
                <button onclick="handleLike(${post.id})">
                    <i class="fa-regular fa-thumbs-up"></i> Like (${post.likes || 0})
                </button>
                <button onclick="showComments(${post.id})">
                    <i class="fa-regular fa-comment"></i> Comments (${post.comments ? post.comments.length : 0})
                </button>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Handle profile picture upload
function handleProfilePicUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePic').src = e.target.result;
            updateUserProfile('profilePic', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Handle cover photo upload
function handleCoverPhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('coverPhoto').src = e.target.result;
            updateUserProfile('coverPhoto', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Update user profile in localStorage
function updateUserProfile(key, value) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    console.log(users)
    console.log(userIndex)
    
    if (userIndex !== -1) {
        users[userIndex][key] = value;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Update current user session as well
    if (localStorage.getItem('currentUser')) {
        const updatedUser = { ...currentUser, [key]: value };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    } else if (sessionStorage.getItem('currentUser')) {
        const updatedUser = { ...currentUser, [key]: value };
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
}

// Show edit profile modal
function showEditProfileModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.id === currentUser.id);

    if (user) {
        document.getElementById('bioInput').value = user.bio || '';
        document.getElementById('locationInput').value = user.location || '';
        document.getElementById('workInput').value = user.work || '';
        document.getElementById('educationInput').value = user.education || '';
    }

    document.getElementById('editProfileModal').style.display = 'block';
}

// Close edit profile modal
function closeEditProfileModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

// Handle edit profile form submission
document.getElementById('editProfileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const bio = document.getElementById('bioInput').value;
    const location = document.getElementById('locationInput').value;
    const work = document.getElementById('workInput').value;
    const education = document.getElementById('educationInput').value;

    updateUserProfile('bio', bio);
    updateUserProfile('location', location);
    updateUserProfile('work', work);
    updateUserProfile('education', education);

    document.getElementById('bioText').textContent = bio || 'Add a bio';
    document.getElementById('locationText').textContent = location || 'Add location';
    document.getElementById('workText').textContent = work || 'Add work';
    document.getElementById('educationText').textContent = education || 'Add education';

    closeEditProfileModal();
});

// Show post modal
function showPostModal() {
    document.getElementById('postModal').style.display = 'block';
}

// Close post modal
function closePostModal() {
    document.getElementById('postModal').style.display = 'none';
}

// Handle create post form submission
document.getElementById('createPostForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const postText = document.getElementById('postText').value;
    const postImage = document.getElementById('postImage').files[0];
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.id === currentUser.id);
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    const newPost = {
        id: Date.now(),
        userId: currentUser.id,
        text: postText,
        timestamp: Date.now(),
        likes: 0,
        comments: [],
        userDetails: {
            name: `${user.firstName} ${user.lastName}`,
            profilePic: user.profilePic || 'default-profile-pic-url'
        }
    };

    if (postImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPost.image = e.target.result;
            saveAndDisplayPost(newPost, user);
        };
        reader.readAsDataURL(postImage);
    } else {
        saveAndDisplayPost(newPost, user);
    }
});

function saveAndDisplayPost(newPost, user) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.unshift(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    
    // Reload all posts after saving
    loadUserPosts(user);
    closePostModal();
    document.getElementById('createPostForm').reset();
}

// Add this new function to handle adding posts to the page
function addPostToPage(post, user) {
    const postsContainer = document.getElementById('postsContainer');
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
        <div class="post-header">
            <img src="${user.profilePic || 'default-profile-pic-url'}" alt="Profile Picture" class="profile-pic">
            <div>
                <h3>${user.firstName} ${user.lastName}</h3>
                <p>${new Date(post.timestamp).toLocaleString()}</p>
            </div>
        </div>
        <p>${post.text}</p>
        ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
    `;
    postsContainer.insertBefore(postElement, postsContainer.firstChild);
}

// Update handleLike to pass full user object instead of just ID
function handleLike(postId) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        posts[postIndex].likes = (posts[postIndex].likes || 0) + 1;
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // Fetch full user object from updated users array
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.id === currentUser.id);
        loadUserPosts(user);
    }
}

// Firebase posts integration start
async function fetchingPosts() {
    let response = await fetch("https://facebook-ce39f-default-rtdb.firebaseio.com/posts.json");
    let res = await response.json();
    console.log(res);
    let posts = res ? Object.entries(res).map(([id, data]) => ({ id, ...data })) : [];
    displayPosts(posts);
}
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
function displayPosts(posts) {
    console.log('ggg')
    postsContainer.innerHTML = ""; 
    posts.forEach(post => {
        if (!post || !post.timestamp) {
            console.warn("Invalid post detected", post);
            return; 
        }
        let postElement = document.createElement("div");
        postElement.classList.add("post");
        
        let currentuser = currentUser.firstName || "Guest"; 
        let isLiked = post.likedUsers && post.likedUsers.includes(currentuser);
        console.log('xxx')
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${post.profile_pic || "./navbar/Logo.webp"}" alt="${post.username || "Guest"}" class="profile-pic">
                <div>
                    <h4>${post.username || "Guest"}</h4>
                    <p>${new Date(post.timestamp).toLocaleString()}</p>
                </div>
                <div class="posts-options">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
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
        console.log('sss')
        postsContainer.appendChild(postElement);
        let menuIcon = postElement.querySelector(".fa-ellipsis-vertical");
        let dropdownMenu = postElement.querySelector(".dropdown-menu");

        menuIcon.addEventListener("click", (event) => {
            event.stopPropagation();
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
    document.querySelectorAll('.likes').forEach(button => {
        button.addEventListener('click', async (e) => {
            let postId = e.target.closest('.likes').dataset.postId;
            await updateLikes(postId);
        });
    });
    document.querySelectorAll('.comments').forEach(button => {
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
let photo = document.getElementById("poto");

document.querySelector(".input-section input").addEventListener("click", () => {
    postPopup.style.display = "block";
});
photo.addEventListener("click", () => {
    postPopup.style.display = "block";
});
closePopup.addEventListener("click", () => {
    postPopup.style.display = "none";
});

async function uploadImage(file) {
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

postButton.addEventListener("click", async () => {
    let content = postText.value.trim();
    let imageFile = postImage.files[0];

    if (!content) {
        alert("Post cannot be empty!");
        return;
    }
    let imageUrl = imageFile ? await uploadImage(imageFile) : null;

    let response = await fetch("https://facebook-ce39f-default-rtdb.firebaseio.com/posts.json");
    let posts = await response.json();
    let newPostId = posts ? Object.keys(posts).length + 1 : 1;
    console.log("profilepic", currentUser.profilePic);
    let newPost = {
        id: newPostId,
        username: currentUser.firstName || "Guest",
        profile_pic: currentUser.profilePic, 
        content: content,
        image: imageUrl,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: ["none"]
    };
    await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${newPostId - 1}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
    });

    postPopup.style.display = "none";
    postText.value = "";
    postImage.value = "";
    fetchingPosts();
});

async function updateLikes(postId) {
    let response = await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId - 1}.json`);
    let post = await response.json();

    if (!post.likedUsers) {
        post.likedUsers = [];
    }
    let currentuser = currentUser.firstName || "Guest"; 
    if (!post.likedUsers.includes(currentuser)) {
        post.likes += 1;
        post.likedUsers.push(currentuser);
    } else {
        post.likes -= 1;
        post.likedUsers = post.likedUsers.filter(user => user !== currentuser);
    }
    await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId - 1}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    fetchingPosts();
}

async function openCommentPopup(postId) {
    let response = await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId - 1}.json`);
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
    document.body.appendChild(popup);
    popup.querySelector('.close-popup').addEventListener('click', () => {
        document.body.removeChild(popup);
    });
    popup.querySelector('.submit-comment').addEventListener('click', async () => {
        let commentText = popup.querySelector('#commentText').value;
        if (commentText.trim()) {
            await addComment(postId, commentText);
            document.body.removeChild(popup);
        }
    });
}

async function addComment(postId, commentText) {
    let response = await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId - 1}.json`);
    let post = await response.json();
    let username = currentUser.firstName || "Guest";  
    if (!post.comments) {
        post.comments = [];
    }
    post.comments.push({ username: username, content: commentText });
    await fetch(`https://facebook-ce39f-default-rtdb.firebaseio.com/posts/${postId - 1}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    });
    fetchingPosts();
}
// Firebase posts integration end











