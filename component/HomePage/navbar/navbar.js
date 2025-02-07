document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.getElementById("navbar-container");

    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <header>
                <nav>
                    <div class="nav-left">
                        <a href="Home.html"><img src="./navbar/Logo.webp" alt="logo" /></a>
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div class="nav-center">
                        <a href="Home.html" id="home"><i class="fa-solid fa-house"></i></a>
                        <a href="friends.html" id="friends"><i class="fa-solid fa-user-group"></i></a>
                        <a href="videos.html" id="videos"><i class="fa-brands fa-youtube"></i></a>
                        <a href="marketplace.html" id="marketplace"><i class="fa-solid fa-store"></i></a>
                        <a href="groups.html" id="groups"><i class="fa-solid fa-people-group"></i></a>
                    </div>
                    <div class="nav-right">
                        <a href="messages.html"><i class="fa-brands fa-facebook-messenger"></i></a>
                        <a href="notifications.html"><i class="fa-solid fa-bell"></i></a>
                        <a href="profile.html"><img class="profile-pic" src="./navbar/Logo.webp" alt="profile" /></a>
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
        `;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./navbar/navbar.css";
        document.head.appendChild(link);
        highlightActivePage();
        addEventListeners();
    }
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
