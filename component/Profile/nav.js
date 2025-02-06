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
                        <a href="../HomePage/Home.html"><img src="../../assets/Logo.webp" alt="logo" /></a>
                        <input type="text" placeholder="Search..." />
                    </div>
                    <div class="nav-center">
                        <a href="../HomePage/Home.html"><i class="fa-solid fa-house"></i></a>
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
    }

    loadStyles() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                margin: 0;
                font-family: Arial, sans-serif;
                padding-top: 3.5rem;
            }

            header {
                background-color: white;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                position: fixed;
                top: 0;
                width: 100%;
                z-index: 1000;
            }

            nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.8rem 1.2rem;
                height: 3rem;
            }

            .nav-left,.nav-center,.nav-right {
                display: flex;
                align-items: center;
            }

            .nav-left input {
                margin-left: 0.8rem;
                padding: 0.5rem;
                border: 1px solid lightgray;
                border-radius: 1.2rem;
                outline: none;
                width: 12.5rem;
            }
            .nav-center a{
                margin: 0 1.5rem;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                transition: background-color 0.3s ease;
            }
            .nav-right a {
                margin: 0 0.8rem;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                transition: background-color 0.3s ease;
            }

            .nav-center a i, .nav-right a i {
                font-size: 1.2rem;
                color: rgb(100, 100, 100);
                transition: color 0.3s ease;
            }

            .nav-center a:hover, .nav-right a:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }

            .nav-center a:hover i, .nav-right a:hover i {
                color: #0866ff;
            }

            .nav-right a img, .nav-left a img {
                width: 2.5rem;
                height: 2.5rem;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid transparent;
                transition: border 0.3s ease;
            }

            .nav-right a img:hover {
                border: 2px solid #0866ff;
            }
            .nav-left input:hover{
              border-color: #0866ff;
              cursor: text;
            }

            .setting_menu {
                position: absolute;
                width: 90%;
                max-width: 350px;
                background-color: #fff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
                overflow: hidden;
                top: 108%;
                right: 5%;
                max-height: 0;
                transition: max-height 1s;
                border-radius: 4px;
            }

            .setting_menu_height {
                max-height: 450px;
            }

            .user_profile {
                display: flex;
                align-items: center;
            }

            .user_profile i {
                margin-right: 20px;
            }

            .user_info {
                display: flex;
                flex-direction: column;
                min-width: 0; /* Add this to prevent flex items from overflowing */
            }

            .user_info a {
                font-size: 12px;
                color: #1876f2;
                text-decoration: none;
                white-space: nowrap; /* Keep text in a single line */
                width: auto; /* Allow the link to take its natural width */
                margin: 0; /* Reset margins */
                padding: 0; /* Reset padding */
                height: auto; /* Reset height */
                display: inline; /* Change from flex to inline */
            }

            .user_info p {
                margin-bottom: 5px;
                font-weight: 500;
                color: #626262;
                margin-top: 0;
            }

            .settings_menu_inner {
                padding: 20px;
            }

            .setting_menu hr {
                border: 0;
                height: 1px;
                background-color: #9a9a9a;
                margin: 15px 0;
            }

            .setting_link {
                display: flex;
                align-items: center;
                margin: 15px 0;
            }

            .setting_link .setting_icon {
                width: 38px;
                margin-right: 10px;
                border-radius: 50%;
            }

            .setting_link a {
                display: flex;
                flex: 1;
                align-items: center;
                justify-content: space-between;
                text-decoration: none;
                color: #626262;
            }
        `;
        this.shadowRoot.appendChild(style);

        // Load external CSS for Font Awesome
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