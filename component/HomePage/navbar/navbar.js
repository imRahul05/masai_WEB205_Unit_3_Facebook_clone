let currUser=(JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser')) )|| "Guest"; 
let profilePic = document.getElementById("profile-pic");
if (currUser.profilePic) {
    profilePic.src = currUser.profilePic;
}
document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.getElementById("navbar-container");
    

    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <header>
                <nav>
                    <div class="nav-left">
                        <a href="Home.html"><img src="./navbar/Logo.webp" alt="logo" /></a>
                        <input id="search-input" type="text" placeholder="Search..." />
                    </div>
                    <div class="nav-center">
                        <a href="Home.html" id="home"><i class="fa-solid fa-house"></i></a>
                        <a href="sidebarPage/findFriend.html" id="friends"><i class="fa-solid fa-user-group"></i></a>
                        <a href="sidebarPage/videoPage/video.html" id="videos"><i class="fa-brands fa-youtube"></i></a>
                        <a href="sidebarPage/marketPlacePage/market.html" id="marketplace"><i class="fa-solid fa-store"></i></a>
                        <a href="sidebarPage/groupPage/group.html" id="groups"><i class="fa-solid fa-people-group"></i></a>
                    </div>
                    <div class="nav-right">
                         <a href="message/message.html"><i class="fa-brands fa-facebook-messenger"></i></a>
                        <a href="notifications/notifications.html"><i class="fa-solid fa-bell"></i></a>
                        <a href="../Profile/profile.html"><img id="profile-pic" class="profile-pic" src="./navbar/Logo.webp" alt="profile" /></a>
                        <div class="setting_menu">
                            <div class="settings_menu_inner">
                                <div class="user_profile">
                                    <i class="fa-solid fa-user"></i>
                                    <div class="user_info">
                                        
                                          <a href="../Profile/index.html">See Your Profile</a>
                                    </div>
                                </div>
                                <hr />
                                <div class="setting_link">
                                    <i class="fa-solid fa-cog setting_icon"></i>
                                    <a href="#">Setting & Privacy <i class="fa-solid fa-chevron-right"></i></a>
                                </div>
                                <div class="setting_link">
                                    <i class="fa-solid fa-question-circle setting_icon"></i>
                                    <a href="#">Help & Support <i class="fa-solid fa-chevron-right"></i></a>
                                </div>
                                <div class="setting_link">
                                    <i class="fa-solid fa-adjust setting_icon"></i>
                                    <a href="#">Display & Accessibility <i class="fa-solid fa-chevron-right"></i></a>
                                </div>
                                <div class="setting_link">
                                    <i class="fa-solid fa-sign-out-alt setting_icon"></i>
                                    <a href="#" id="logout">Logout <i class="fa-solid fa-chevron-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <div class="search-modal" id="search-modal">
                <div class="search-modal-content">
                    <div id="search-results"></div>
                    <button id="close-search-modal">Close</button>
                </div>
            </div>
        `;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./navbar/navbar.css";
        document.head.appendChild(link);
        highlightActivePage();
        addEventListeners();
    }
    const searchInput = document.getElementById("search-input");
    const searchModal = document.getElementById("search-modal");
    const searchResults = document.getElementById("search-results");
    const closeModal = document.getElementById("close-search-modal");

    // Handle search input
    searchInput.addEventListener("input", function () {
        const query = searchInput.value.trim();
        if (query.length > 0) {
            fetchSearchResults(query);
        } else {
            searchModal.classList.remove("active");
        }
    });

    async function fetchSearchResults(query) {
        try {
            let res = await fetch("https://facebook-ce39f-default-rtdb.firebaseio.com/posts.json");
            let data = await res.json();
            console.log("data", data);

            let filteredResults = {};
            for (const key in data) {
                let username = data[key]?.username || ''; 
                console.log("search", username);
                
                if (username.toLowerCase().includes(query.toLowerCase())) {
                    filteredResults[key] = data[key];
                }
            }
    
            // Display filtered results
            displaySearchResults(filteredResults);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    }
    
    // Display search results in the modal
    function displaySearchResults(results) {
        searchResults.innerHTML = ""; // Clear previous results
        for (const key in results) {
            const user = results[key];
            const resultElement = document.createElement("a");
            resultElement.href = `profile.html?user=${key}`;
            resultElement.innerHTML = `<img src="${user.profilePic || './navbar/Logo.webp'}" alt="${user.username}" /> ${user.username}`;
            searchResults.appendChild(resultElement);
        }

        // Show the modal
        searchModal.classList.add("active");
    }

    // Close the search modal
    closeModal.addEventListener("click", function () {
        searchModal.classList.remove("active");
    });

    // Close the modal if clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === searchModal) {
            searchModal.classList.remove("active");
        }
    });
});

function highlightActivePage() {
    const links = {
        "Home.html": "home",
        "friends.html": "friends",
        "videos.html": "videos",
        "marketplace.html": "marketplace",
        "groups.html": "groups",
    };

    let currentPage = window.location.pathname.split("/").pop(); // Get current page name
    let activeLinkId = links[currentPage];

    if (activeLinkId) {
        document.getElementById(activeLinkId)?.classList.add("active");
    }
}

function addEventListeners() {
    const profilePic = document.querySelector('.profile-pic');
    const settingMenu = document.querySelector('.setting_menu');
    const logoutButton = document.querySelector('#logout');

    if (profilePic && settingMenu) {
        profilePic.addEventListener('mouseenter', () => {
            settingMenu.classList.add('setting_menu_height');
        });

        profilePic.addEventListener('mouseleave', () => {
            settingMenu.classList.remove('setting_menu_height');
        });

        settingMenu.addEventListener('mouseenter', () => {
            settingMenu.classList.add('setting_menu_height');
        });

        settingMenu.addEventListener('mouseleave', () => {
            settingMenu.classList.remove('setting_menu_height');
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            window.location.href = '../../index.html';
        });
    }
}
