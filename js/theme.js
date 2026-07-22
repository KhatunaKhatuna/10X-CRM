// js/theme.js
// This script runs synchronously in the <head> to prevent FOUC (Flash of Unstyled Content)

(function () {
  // 1. Sidebar State
  if (getSidebarState()) {
    document.documentElement.setAttribute("data-sidebar", "collapsed");
  }
})();
