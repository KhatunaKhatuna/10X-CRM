/**
 * Clients Module Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("clients-grid");

  container.innerHTML = '<p class="loading-text">Loading clients...</p>';

  const { clients, error } = await initClientsData();

  container.innerHTML = '';

  // TODO (Phase 3): Render clients to the DOM
  // renderClients(clients);
});
