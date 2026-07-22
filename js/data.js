/**
 * Shared Data Logic
 * Centralizes data fetching and manipulation so both Dashboard and Clients pages can use it.
 */

/**
 * Initializes client data.
 * Checks localStorage first, if missing, fetches from API and stores.
 * @returns {Promise<Array>}
 */

async function initClientsData() {
  let clients = getClients();

  // If no clients in storage, fetch from API
  if (!clients || clients.length === 0) {
    try {
      const response = await fetch('https://dummyjson.com/users?limit=30');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform API data to CRM Client format
      clients = data.users.map(user => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        company: user.company?.name || "Independent",
        image: user.image,
        status: "Lead",
        dealValue: Math.floor(Math.random() * 9501) + 500,
        notes: [],
        createdAt: new Date().toISOString()
      }));

      saveClients(clients);

      return { clients, error: null };
    } catch (error) {
      console.error("Failed to fetch clients:", error.message);
      return {
        clients: [],
        error: "Could not load clients. Check your connection and try again."
      };
    }
  } else {
    return { clients, error: null };
  }
}
