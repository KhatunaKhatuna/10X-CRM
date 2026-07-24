// js/theme.js
// This script runs synchronously in the <head> to prevent FOUC (Flash of Unstyled Content)

(function () {
  // 1. Sidebar State
  if (getSidebarState()) {
    document.documentElement.setAttribute("data-sidebar", "collapsed");
  }

  // 2. Theme State
  const theme = localStorage.getItem('crm_theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-theme');
  }
})();
