document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.getElementById("navbar-container");

    if (navbarContainer) {
        // Insert the navbar HTML directly
        navbarContainer.innerHTML = `
            <header>
                <nav>
                    <div class="nav-left">
                        <a href="Home.html"><img src="./navbar/Logo.webp" alt="logo" /></a>
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div class="nav-center">
                        <a href="./Home.html" id="home"><i class="fa-solid fa-house"></i></a>
                        <a href="friends.html" id="friends"><i class="fa-solid fa-user-group"></i></a>
                        <a href="videos.html" id="videos"><i class="fa-brands fa-youtube"></i></a>
                        <a href="marketplace.html" id="marketplace"><i class="fa-solid fa-store"></i></a>
                        <a href="groups.html" id="groups"><i class="fa-solid fa-people-group"></i></a>
                    </div>
                    <div class="nav-right">
                        <a href="messages.html"><i class="fa-brands fa-facebook-messenger"></i></a>
                        <a href="notifications.html"><i class="fa-solid fa-bell"></i></a>
                        <a href="profile.html"><img src="./navbar/Logo.webp" alt="profile" /></a>
                    </div>
                </nav>
            </header>
        `;

        // Load CSS dynamically
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./navbar/navbar.css";
        document.head.appendChild(link);

        // Highlight the active page
        highlightActivePage();
    }
});

function highlightActivePage() {
    const links = {
        "Home.html": "home",
        "friends.html": "friends",
        "videos.html": "videos",
        "marketplace.html": "marketplace",
        "groups.html": "groups"
    };

    let currentPage = window.location.pathname.split("/").pop(); // Get current page name
    let activeLinkId = links[currentPage];

    if (activeLinkId) {
        document.getElementById(activeLinkId)?.classList.add("active");
    }
}
