document.addEventListener("DOMContentLoaded", function() {
    const navbarContainer = document.getElementById("navbar-container");
    
    if (navbarContainer) {
        navbarContainer.innerHTML = `
            <header>
                <nav>
                    <div class="nav-left">
                        <a href="#"><img src="./navbar/Logo.webp" alt="logo" /></a>
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div class="nav-center">
                        <a href="#"><i class="fa-solid fa-house"></i></a>
                        <a href="#"><i class="fa-solid fa-user-group"></i></a>
                        <a href="#"><i class="fa-brands fa-youtube"></i></a>
                        <a href="#"><i class="fa-solid fa-store"></i></a>
                        <a href="#"><i class="fa-solid fa-people-group"></i></a>
                    </div>
                    <div class="nav-right">
                        <a href="#"><i class="fa-solid fa-bell"></i></a>
                        <a href="#"><img src="./navbar/Logo.webp" alt="profile" /></a>
                    </div>
                </nav>
            </header>
        `;

        // Load CSS dynamically
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "./navbar/navbar.css";
        document.head.appendChild(link);
    }
});
