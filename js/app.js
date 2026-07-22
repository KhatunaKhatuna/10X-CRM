document.addEventListener("DOMContentLoaded", () => {
  // 1. Sidebar Toggle Logic
  const sidebarToggle = document.getElementById("sidebar-toggle");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      const html = document.documentElement;
      const isCollapsed = html.getAttribute("data-sidebar") === "collapsed";

      if (isCollapsed) {
        html.removeAttribute("data-sidebar");
        saveSidebarState(false);
      } else {
        html.setAttribute("data-sidebar", "collapsed");
        saveSidebarState(true);
      }
    });
  }
  // 2. Profile Dropdown Logic
  const profileTrigger = document.getElementById("profile-trigger");
  const profileMenu = document.querySelector(".profile-menu");

  if (profileTrigger && profileMenu) {
    profileTrigger.addEventListener("click", (e) => {

      profileMenu.classList.toggle("open");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!profileMenu.contains(e.target)) {
        profileMenu.classList.remove("open");
      }
    });
  }

  // 3. User Data Integration (Welcome text, avatar)
  const session = getSession();
  const users = getUsers();

  if (session) {
    const currentUser = users.find(user => user.email === session.email);
    if (currentUser) {
      const welcomeText = document.getElementById("welcome-text");
      const profileAvatar = document.getElementById("profile-avatar");

      if (welcomeText) {
        const firstName = currentUser.fullName.split(" ")[0];
        welcomeText.textContent = `Welcome back, ${firstName}`;
      }

      if (profileAvatar) {
        // Extract initials
        const initials = currentUser.fullName.split(" ").map(name => name[0]).join("").substring(0, 2).toUpperCase();
        profileAvatar.textContent = initials;
      }
    }
  }

  // 4. Logout Logic
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearSession();
      window.location.replace("index.html");
    });
  }
});

