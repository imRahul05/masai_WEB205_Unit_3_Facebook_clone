// Initialize local storage with some dummy data if empty
if (!localStorage.getItem('users')) {
    const dummyUsers = [
        {
            id: 'fake1',
            firstName: 'Sarah',
            lastName: 'Johnson',
            email: 'sarah@example.com',
            password: 'password123',
            profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            bio: 'Adventure seeker | Photography lover | Coffee addict',
            location: 'San Francisco, CA',
            work: 'Senior Designer at Creative Co',
            education: 'Art Institute of California',
            friends: ['fake2', 'fake3'],
            friendRequests: []
        },
        {
            id: 'fake2',
            firstName: 'Mike',
            lastName: 'Wilson',
            email: 'mike@example.com',
            password: 'password123',
            profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
            bio: 'Food enthusiast | Amateur chef | Travel lover',
            location: 'Chicago, IL',
            work: 'Head Chef at Tasty Bites',
            education: 'Culinary Institute of America',
            friends: ['fake1'],
            friendRequests: []
        },
        {
            id: 'fake3',
            firstName: 'Emily',
            lastName: 'Davis',
            email: 'emily@example.com',
            password: 'password123',
            profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
            bio: 'Tech professional | Dog lover | Fitness enthusiast',
            location: 'New York, NY',
            work: 'Product Manager at Tech Corp',
            education: 'MIT',
            friends: ['fake1'],
            friendRequests: []
        }
    ];
    localStorage.setItem('users', JSON.stringify(dummyUsers));
}

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const signupModal = document.getElementById('signupModal');

// Populate date dropdowns
function populateDateDropdowns() {
    const daySelect = document.getElementById('day');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');

    // Days
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        daySelect.appendChild(option);
    }

    // Months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    // Years (100 years back from current year)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 100; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}

populateDateDropdowns();

// Show signup modal
function showSignup() {
    signupModal.style.display = 'block';
}

// Close signup modal
function closeSignup() {
    signupModal.style.display = 'none';
}

// Handle login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store session
        const sessionData = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(sessionData));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(sessionData));
        }

        // Fixed redirect path
        window.location.href = './component/HomePage/Home.html';
    } else {
        alert('Invalid email or password');
    }
});

// Handle signup
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const day = document.getElementById('day').value;
    const month = document.getElementById('month').value;
    const year = document.getElementById('year').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;

    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert('Email already exists');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password,
        birthday: `${year}-${month}-${day}`,
        gender,
        friends: [],
        friendRequests: [],
        profilePic: '',
        coverPhoto: '',
        bio: '',
        location: '',
        work: '',
        education: ''
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully! Please log in.');
    closeSignup();
    loginForm.reset();
});