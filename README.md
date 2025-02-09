# Facebook Clone 

## Overview
This project is a Facebook clone built. It mimics core Facebook features such as authentication, posting, notifications, and interactive UI components.

## Project Structure
```

├── .vscode/
│   └── settings.json
├── README.md
├── assets/
│   └── Logo.webp
├── auth/
│   └── auth.js
├── component/
│   ├── HomePage/
│   │   ├── Home.html
│   │   ├── home.css
│   │   ├── home.js
│   │   ├── message/
│   │   │   └── message.html
│   │   ├── navbar/
│   │   │   ├── Logo.webp
│   │   │   ├── navbar.css
│   │   │   ├── navbar.html
│   │   │   └── navbar.js
│   │   ├── notifications/
│   │   │   └── notifications.html
│   │   └── sidebarPage/
│   │       ├── find-friends.css
│   │       ├── find-friends.js
│   │       ├── findFriend.html
│   │       ├── groupPage/
│   │       │   ├── group.html
│   │       │   └── groups.css
│   │       ├── marketPlacePage/
│   │       │   ├── market.html
│   │       │   └── marketplace.css
│   │       ├── memoriesPage/
│   │       │   ├── memories.css
│   │       │   ├── memories.html
│   │       │   └── memories.js
│   │       ├── navbar.js
│   │       ├── savedPage/
│   │       │   ├── saved.css
│   │       │   ├── saved.html
│   │       │   └── saved.js
│   │       └── videoPage/
│   │           ├── video.css
│   │           └── video.html
│   ├── Profile/
│   │   ├── index.html
│   │   ├── nav.js
│   │   ├── profile.css
│   │   └── profile.js
│   └── forgotPassword/
│       ├── forgot-password.css
│       ├── forgot-password.html
│       └── forgot-password.js
├── index.html
├── index.js
└── styles.css
```

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your_username/masai_WEB205_Unit_3_Facebook_clone.git
   ```
2. Live server:
   ```bash
   Open with live server
   ```


## Usage

- Open `index.html` in your browser.
- Use the login or create account options to interact with the app.
- Explore additional pages (Home, Profile, Notifications, etc.) via the components.

### Home Page
The home page is located at `Home.html`. It includes the main feed and navigation bar.

### Profile Page
The profile page is located at `index.html`. It displays user information and allows users to update their profile.

### Video Page
The video page is located at `video.html`. It allows users to view and upload videos.

### Navbar
The navigation bar is dynamically included in each page using the `nav.js` file located at `nav.js`. It adjusts the paths based on the current location of the HTML file.

### Authentication
The authentication logic is handled in the `auth.js` file located at `auth.js`.

### Features
- **User Authentication**: Users can log in and log out.
- **Profile Management**: Users can view and update their profile information.
- **Video Uploads**: Users can upload and view videos.
- **Dynamic Navigation Bar**: The navigation bar adjusts paths dynamically based on the current location of the HTML file.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.


## Contact
If you have any questions or suggestions, feel free to reach out to the project maintainer at `rahulkumar20000516@gmail.com`.


## Screenshots

### Feature Overview
| Feature | Screenshot |
|---------|------------|
| Login Page | <img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/login.png" alt="Login Page" width="400"/> |
| Sign Up | <img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/signup.png" alt="Sign Up Page" width="400"/> |
| Forgot Password | <img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/forgot-password.png" alt="Forgot Password Page" width="400"/> |
| Home Page | <img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/homepage.png" alt="Home Page" width="400"/> |
| Create Story | <img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/create-story.png" alt="Create Story Feature" width="400"/> |
| Create Post | <img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/create-post.png" alt="Create Post Feature" width="400"/> |
| Messages | <img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/mesage.png" alt="Messages Feature" width="400"/> |
| Notifications | <img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/notification.png" alt="Notifications Feature" width="400"/> |

### Individual Features

#### Authentication
<img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/login.png" alt="Login Page" width="800"/>

#### Home Feed
<img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/homepage.png" alt="Home Page" width="800"/>

#### Story Creation
<img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/create-story.png" alt="Create Story Feature" width="800"/>

#### Messaging
<img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/mesage.png" alt="Messages Feature" width="800"/>

#### Notifications Center
<img src="https://github.com/imRahul05/masai_WEB205_Unit_3_Facebook_clone/blob/main/assets/notification.png" alt="Notifications Feature" width="800"/>