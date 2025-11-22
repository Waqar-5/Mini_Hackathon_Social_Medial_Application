# SocialApp — Mini Social Media Application

A simple, lightweight social media web application built with **HTML**, **CSS**, and **JavaScript**, featuring user authentication, post creation, comments, reactions, and a dashboard. It supports **dark mode** and responsive design for mobile and desktop screens.


![Uploading Screenshot (178).png…]()


---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Features

- **User Authentication**: Sign up and login functionality stored in `localStorage`.
- **Posts**:
  - Create, edit, and delete posts.
  - Add optional images via URL.
- **Comments**: Users can comment on posts.
- **Reactions**: React to posts with emojis (`👍`, `❤️`, `😂`, `😮`, `😢`).
- **Dashboard**: Users can manage their posts from a private dashboard.
- **Search and Sort**: Filter posts by search or sort by latest, oldest, or most liked.
- **Responsive Design**: Works on both desktop and mobile devices.
- **Dark Mode**: Toggle between light and dark themes.

---

## Demo

![SocialApp Screenshot](https://github.com/<Waqar-5>/<repo-name>/raw/main/Screenshot%20(178).png)


---




## Technologies Used

- **HTML5**
- **CSS3** (with custom styles and responsive design)
- **JavaScript (Vanilla)**:
  - DOM manipulation
  - Local storage for users and posts
  - Event handling
- **Bootstrap 5** for layout and responsive components
- **SweetAlert2** for stylish alerts and confirmations

---

## functionalities

Usage
Login / Sign Up:

Click the Login button on the navbar.

Switch between Login and Sign Up tabs.

After logging in, your username appears in the navbar with a Logout option.

Create Post:

Go to Dashboard.

Fill in the post title, description, and optional image URL.

Click Publish to add the post.

Edit / Delete Post:

Posts you own display Edit and Delete buttons.

Editing pre-fills the form; deleting asks for confirmation.

Comment on Posts:

Enter a comment in the input box below a post and click Comment.

React to Posts:

Click any emoji reaction to increase its count.

Search & Sort:

Use the search input to filter posts.

Use the sort dropdown to reorder posts.

Dark Mode:

Click the 🌙 / ☀️ button to toggle light/dark themes. Your choice is saved in localStorage.

Project Structure
bash
Copy code
socialapp/
│
├── index.html        # Main HTML file
├── style.css         # CSS styles
├── script.js         # JavaScript logic
└── README.md         # Project documentation
Contributing
Contributions are welcome!

Fork the repository.

Create a new branch: git checkout -b feature/YourFeature

Commit your changes: git commit -m "Add your message"

Push to branch: git push origin feature/YourFeature

Open a pull request.

License
This project is open-source and available under the MIT License.

