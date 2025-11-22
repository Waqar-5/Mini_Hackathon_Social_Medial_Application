

const homePage = document.getElementById("home-page");
const dashboardPage = document.getElementById("dashboard-page");
const homeLink = document.getElementById("home-link");
const dashboardLink = document.getElementById("dashboard-link");
const authBtn = document.getElementById("auth-btn");
const authModal = document.getElementById("auth-modal");
const loginTab = document.getElementById("login-tab");
const signupTab = document.getElementById("signup-tab");
const loginFormContent = document.getElementById("login-form-content");
const signupFormContent = document.getElementById("signup-form-content");
const closeAuth = document.getElementById("close-auth");
const closeAuth2 = document.getElementById("close-auth-2");
const toggleThemeBtn = document.getElementById("toggle-theme");

const postsContainer = document.getElementById("posts-container");
const userPostsContainer = document.getElementById("user-posts-container");
const postForm = document.getElementById("post-form");
const postIdInput = document.getElementById("post-id");
const postTitleInput = document.getElementById("post-title");
const postDescInput = document.getElementById("post-desc");
const postImageInput = document.getElementById("post-image");
const cancelEditBtn = document.getElementById("cancel-edit");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");

let currentUser = null;

function initApp() {
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    updateAuthUI();
    dashboardLink.style.display = "inline-block";
  }
  setupListeners();
  loadTheme();
  renderPosts();
  renderUserPosts();
}

function setupListeners() {
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    showHome();
  });
  dashboardLink.addEventListener("click", (e) => {
    e.preventDefault();
    showDashboard();
  });
  authBtn.addEventListener("click", handleAuthBtn);
  loginTab.addEventListener("click", () => switchAuthTab("login"));
  signupTab.addEventListener("click", () => switchAuthTab("signup"));
  loginFormContent.addEventListener("submit", handleLogin);
  signupFormContent.addEventListener("submit", handleSignup);
  closeAuth.addEventListener("click", closeAuthModal);
  closeAuth2.addEventListener("click", closeAuthModal);
  authModal.addEventListener("click", (ev) => {
    if (ev.target === authModal) closeAuthModal();
  });
  postForm.addEventListener("submit", handlePostSubmit);
  cancelEditBtn.addEventListener("click", cancelEdit);
  searchInput.addEventListener("input", renderPosts);
  sortSelect.addEventListener("change", renderPosts);
  toggleThemeBtn.addEventListener("click", toggleTheme);
}

// =====================
// Theme
function loadTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggleThemeBtn.textContent = "☀️ ";
  }
}
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  toggleThemeBtn.textContent = isDark ? "☀️" : "🌙 ";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
// =====================

// =====================
// Page Switch
function showHome() {
  homePage.classList.add("active");
  dashboardPage.classList.remove("active");
}
function showDashboard() {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  homePage.classList.remove("active");
  dashboardPage.classList.add("active");
  renderUserPosts();
}
function openAuthModal() {
  authModal.classList.add("active");
}
function closeAuthModal() {
  authModal.classList.remove("active");
}
function switchAuthTab(tab) {
  if (tab === "login") {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    document.getElementById("login-form").style.display = "block";
    document.getElementById("signup-form").style.display = "none";
  } else {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    document.getElementById("signup-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
  }
}
function updateAuthUI() {
  if (currentUser) {
    authBtn.textContent = `Logout (${currentUser.username})`;
    dashboardLink.style.display = "inline-block";
  } else {
    authBtn.textContent = "Login";
    dashboardLink.style.display = "none";
  }
}
function handleAuthBtn() {
  if (currentUser) {
    currentUser = null;
    localStorage.removeItem("currentUser");
    updateAuthUI();
    showHome();
  } else {
    switchAuthTab("login");
    openAuthModal();
  }
}
// =====================

// =====================
// Signup/Login
function handleSignup(e) {
  e.preventDefault();
  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  if (!username || !password) {
    alert("Please fill both fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
    alert("Username already exists");
    return;
  }

  const newUser = { id: Date.now().toString(), username, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  currentUser = { id: newUser.id, username: newUser.username };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  updateAuthUI();
  closeAuthModal();
  signupFormContent.reset();
  renderUserPosts();
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  if (!username || !password) {
    alert("Please fill both fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const found = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!found) {
    alert("Invalid credentials");
    return;
  }

  currentUser = { id: found.id, username: found.username };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  updateAuthUI();
  closeAuthModal();
  renderUserPosts();
}
// =====================

// =====================
// Posts
function getPosts() {
  return JSON.parse(localStorage.getItem("posts")) || [];
}
function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function renderPosts() {
  let posts = getPosts();
  const search = searchInput.value.toLowerCase();
  if (search) {
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }

  const sort = sortSelect.value;
  if (sort === "latest")
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sort === "oldest")
    posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  else if (sort === "mostLiked") {
    posts.sort((a, b) => {
      const sumReactions = (p) =>
        Object.values(p.reactions || {}).reduce((acc, val) => acc + val, 0);
      return sumReactions(b) - sumReactions(a);
    });
  }

  postsContainer.innerHTML = posts.map(renderPostCard).join("");
}

function renderUserPosts() {
  if (!currentUser) return;
  const posts = getPosts()
    .filter((p) => p.authorId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  userPostsContainer.innerHTML = posts.map(renderPostCard).join("");
}

function renderPostCard(p) {
  return `
  <div class="post-card">
    ${p.imageUrl ? `<img class="post-image" src="${p.imageUrl}" />` : ""}
    <div class="post-content">
      <div class="post-title mb-2">${p.title}</div>
      <div class="post-description mb-2">${p.description}</div>
      <div class="post-meta mb-2">
  By <b>${p.authorName}</b> | ${new Date(
    p.editedAt || p.createdAt
  ).toLocaleString()}
</div>


      <!-- Reactions -->
      <div class="post-reactions mb-2">
        ${renderReactionButtons(p)}
      </div>

      <!-- Edit/Delete -->
      ${
        currentUser && currentUser.id === p.authorId
          ? `
      <div class="post-management mb-2">
        <button class="btn btn-edit mb-1" onclick="editPost('${p.id}')">Edit</button>
        <button class="btn btn-delete mb-1" onclick="deletePost('${p.id}')">Delete</button>
      </div>`
          : ""
      }

      <!-- Comments -->
      <div class="post-comments">
        <div class="comment-input mb-2">
          <input type="text" id="comment-${
            p.id
          }" placeholder="Write a comment..." class="form-control mb-1"/>
          <button class="btn btn-sm btn-primary mt-1" onclick="addComment('${
            p.id
          }')">Comment</button>
        </div>
       <div class="comments-list">
  ${
    p.comments
      ? p.comments
          .map(
            (c) => `
    <div class="comment mb-2" style="border-left: 3px solid #2b6ef6; padding-left: 6px;">
      <div class="comment-author"><b>${c.authorName}</b></div>
      <div class="comment-time" style="font-size: 0.8rem; color: #666;">${new Date(
        c.createdAt
      ).toLocaleTimeString()}</div>
      <div class="comment-text">${c.text}</div>
    </div>`
          )
          .join("")
      : ""
  }
</div>

      </div>
    </div>
  </div>`;
}

function renderReactionButtons(post) {
  const emojis = ["👍", "❤️", "😂", "😮", "😢"];
  return emojis
    .map(
      (e) => `
    <button class="btn-reaction" onclick="addReaction('${
      post.id
    }','${e}')">${e} ${post.reactions?.[e] || 0}</button>
  `
    )
    .join("");
}

function handlePostSubmit(e) {
  e.preventDefault();
  if (!currentUser) {
    openAuthModal();
    return;
  }
  const id = postIdInput.value;
  const title = postTitleInput.value.trim();
  const desc = postDescInput.value.trim();
  const imageUrl = postImageInput.value.trim();

  if (!title || !desc) return;

  const posts = getPosts();
  if (id) {
    const idx = posts.findIndex(
      (p) => p.id === id && p.authorId === currentUser.id
    );
    if (idx !== -1) {
      posts[idx].title = title;
      posts[idx].description = desc;
      posts[idx].imageUrl = imageUrl;
      posts[idx].editedAt = new Date().toISOString(); // Edited timestamp
    }
  } else {
    posts.push({
      id: Date.now().toString(),
      authorId: currentUser.id,
      authorName: currentUser.username,
      title,
      description: desc,
      imageUrl,
      createdAt: new Date().toISOString(),
      reactions: {},
      userReactions: {},
      comments: [],
    });
  }
  savePosts(posts);
  postForm.reset();
  postIdInput.value = "";
  renderPosts();
  renderUserPosts();
}

function editPost(id) {
  const posts = getPosts();
  const p = posts.find((x) => x.id === id && x.authorId === currentUser.id);
  if (!p) return;
  postIdInput.value = p.id;
  postTitleInput.value = p.title;
  postDescInput.value = p.description;
  postImageInput.value = p.imageUrl || "";
  showDashboard();
}

function cancelEdit() {
  postForm.reset();
  postIdInput.value = "";
}

function deletePost(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to undo this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      const posts = getPosts();
      const idx = posts.findIndex(
        (p) => p.id === id && p.authorId === currentUser.id
      );
      if (idx !== -1) {
        posts.splice(idx, 1);
        savePosts(posts);
        renderPosts();
        renderUserPosts();

        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      }
    }
  });
}
// =====================
// Comments
function addComment(postId) {
  if (!currentUser) {
    openAuthModal();
    return;
  }
  const input = document.getElementById(`comment-${postId}`);
  const text = input.value.trim();
  if (!text) return;
  const posts = getPosts();
  const p = posts.find((x) => x.id === postId);
  if (!p) return;
  p.comments = p.comments || [];
  p.comments.push({
    authorName: currentUser.username,
    text,
    createdAt: new Date().toISOString(),
  });
  savePosts(posts);
  input.value = "";
  renderPosts();
  renderUserPosts();
}

// =====================
// =====================
// Reactions — increment every click
function addReaction(postId, emoji) {
  if (!currentUser) {
    openAuthModal();
    return;
  }

  const posts = getPosts();
  const p = posts.find((x) => x.id === postId);
  if (!p) return;

  p.reactions = p.reactions || {};

  // Simply increment count
  p.reactions[emoji] = (p.reactions[emoji] || 0) + 1;

  savePosts(posts);
  renderPosts();
  renderUserPosts();
}

initApp();
