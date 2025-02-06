class NavigationBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.loadStyles();
        this.addEventListeners();
    }

    render() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users'));
        const user = users.find(u => u.id === currentUser.id);

        this.shadowRoot.innerHTML = `
            <header>
                <nav>
                    <div class="nav-left">
                        <a href="#"../../assets/Logo.webp" alt="logo" /></a>
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
                        <a href="#"><i class="fa-brands fa-facebook-messenger"></i></a>
                        <a href="#"><i class="fa-solid fa-bell"></i></a>
                        <a href="#"><img src="${user.profilePic}" alt="profile" class="profile-pic" /></a>
                        <div class="setting_menu">
                            <div class="settings_menu_inner">
                                <div class="user_profile">
                                    <i class="fa-solid fa-user"></i>
                                    <div class="user_info">
                                        <p>${user.firstName} ${user.lastName}</p>
                                        <a href="#">See Your Profile</a>
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
    }

    loadStyles() {
        const style = document.createElement('style');
        style.textContent = `/* Copy all CSS from navbar.css */`;
        this.shadowRoot.appendChild(style);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        this.shadowRoot.appendChild(link);
    }

    addEventListeners() {
        const profilePic = this.shadowRoot.querySelector('.profile-pic');
        const settingMenu = this.shadowRoot.querySelector('.setting_menu');
        const logoutButton = this.shadowRoot.querySelector('#logout');

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

        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            window.location.href = '../../index.html';
        });
    }
}

customElements.define('navigation-bar', NavigationBar);
