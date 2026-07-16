/**
 * Helper functions to interact with localStorage.
 * Centralizing these functions helps prevent typos in keys and makes the code reusable.
 */

// Keys used in localStorage
const STORAGE_KEYS = {
  USERS: 'crm_users',
  SESSION: 'crm_session',
  CLIENTS: 'crm_clients',
  THEME: 'crm_theme'
};

// --- USERS ---
function getUsers() {
  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersJson ? JSON.parse(usersJson) : [];
}

function saveUsers(usersArray) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersArray));
}

// --- SESSION ---
function getSession() {
  const sessionJson = localStorage.getItem(STORAGE_KEYS.SESSION);
  return sessionJson ? JSON.parse(sessionJson) : null;
}

function saveSession(sessionObj) {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionObj));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// --- CLIENTS ---
function getClients() {
  const clientsJson = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return clientsJson ? JSON.parse(clientsJson) : null; 
  // Returning null instead of [] if not found so we know when to fetch from API
}

function saveClients(clientsArray) {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clientsArray));
}

function clearClients() {
  localStorage.removeItem(STORAGE_KEYS.CLIENTS);
}

// --- THEME ---
function getTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark'; // default is dark
}

function saveTheme(themeName) {
  localStorage.setItem(STORAGE_KEYS.THEME, themeName);
}
