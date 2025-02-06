document.addEventListener("DOMContentLoaded", function() {
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
        
        // Load user's posts
        console.log(user)
        loadUserPosts(user);
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