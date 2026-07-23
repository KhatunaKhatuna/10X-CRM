/**
 * Clients Module Logic
 */

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("clients-grid");

  container.innerHTML = '<p class="loading-text">Loading clients...</p>';

  const { clients, error } = await initClientsData();

  if (error) {
    // FULL: Handle network errors
    container.innerHTML = `
      <div class="error-state">
        <p>${error}</p>
        <button id="retry-btn" class="btn btn--primary" style="margin-top: 1rem;">Retry</button>
      </div>
    `;

    document.getElementById("retry-btn").addEventListener("click", () => {
      window.location.reload();
    });
    return;
  }

  // Render clients to the DOM
  renderClients(clients);

  // Modal UI Logic (Open / Close)
  const btnAddClient = document.getElementById("btn-add-client");
  const modal = document.getElementById("add-client-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");
  const btnCancelModal = document.getElementById("btn-cancel-modal");

  function openModal() {
    modal.classList.add("modal--active");
  }

  function closeModal() {
    modal.classList.remove("modal--active");
    document.getElementById("add-client-form").reset();
  }

  btnAddClient.addEventListener("click", openModal);
  btnCloseModal.addEventListener("click", closeModal);
  btnCancelModal.addEventListener("click", (e) => {
    e.preventDefault();
    closeModal();
  });

  // Close modal when clicking outside the content box
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Form Validation and Submission
  const addClientForm = document.getElementById("add-client-form");
  const btnSaveClient = document.getElementById("btn-save-client");

  // Attach dynamic error clearing to this form
  attachDynamicErrorClearing(addClientForm);

  addClientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFieldErrors(addClientForm);

    if (btnSaveClient.disabled) return;

    const name = addClientForm.name.value.trim();
    const company = addClientForm.company.value.trim();
    const email = addClientForm.email.value.trim().toLowerCase();
    const phone = addClientForm.phone.value.trim();
    const dealValue = addClientForm.dealValue.value.trim();
    const status = addClientForm.status.value;

    let isValid = true;

    if (!name || name.length < 3) {
      showFieldError("client-name", "Name must be at least 3 characters");
      isValid = false;
    }

    if (!email || !isValidEmail(email)) {
      showFieldError("client-email", "Please enter a valid email address");
      isValid = false;
    } else {
      const emailExists = getClients().some(c => c.email.toLowerCase() === email);
      if (emailExists) {
        showFieldError("client-email", "A client with this email already exists");
        isValid = false;
      }
    }

    if (phone && phone.length < 6) {
      showFieldError("client-phone", "Phone number looks too short");
      isValid = false;
    }

    if (!isValidDealValue(dealValue)) {
      showFieldError("client-deal-value", "Deal value must be a number greater than 0");
      isValid = false;
    }

    if (!isValid) return;

    const clientData = {
      name,
      company,
      email,
      phone,
      dealValue,
      status
    };

    const originalText = btnSaveClient.textContent;
    btnSaveClient.textContent = "Saving...";
    btnSaveClient.disabled = true;

    const result = await addClientData(clientData);

    if (result.success) {
      closeModal();
      renderClients(getClients()); // Refresh the UI instantly
      showToast('Client added', 'success');
    } else {
      // General error fallback using PRD-compliant toast notification
      showToast(result.error, 'error');
    }

    btnSaveClient.textContent = originalText;
    btnSaveClient.disabled = false;
  });
});

/**
 * Escapes HTML special characters to prevent XSS when inserting user data into innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Renders the list of clients as cards in the DOM.
 * @param {Array} clients
 */
function renderClients(clients) {
  const container = document.getElementById("clients-grid");
  container.innerHTML = "";

  if (!clients || clients.length === 0) {
    container.innerHTML = '<p class="empty-state">No clients found.</p>';
    return;
  }

  const cardsHTML = clients.map(client => {
    const avatarSrc = client.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random`;

    return `
      <div class="client-card">
        <div class="client-card__header">
          <img src="${escapeHTML(avatarSrc)}" alt="${escapeHTML(client.name)}" class="client-card__avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random'" />
          <div class="client-card__info">
            <h3 class="client-card__name">${escapeHTML(client.name)}</h3>
            <p class="client-card__company">${escapeHTML(client.company)}</p>
          </div>
        </div>
        <div class="client-card__body">
          <p class="client-card__detail">
            <svg class="client-card__icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>
            ${escapeHTML(client.email)}
          </p>
          <p class="client-card__detail">
            <svg class="client-card__icon" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" /></svg>
            ${escapeHTML(client.phone || " ")}
          </p>
        </div>
        <div class="client-card__footer">
          <span class="client-card__status client-card__status--${client.status.toLowerCase()}">${client.status}</span>
          <span class="client-card__deal">$${client.dealValue.toLocaleString()}</span>
        </div>
        <button class="client-card__delete-btn" data-id="${client.id}" title="Delete Client">
          <svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
        </button>
      </div>
    `;
  }).join('');

  container.insertAdjacentHTML('beforeend', cardsHTML);
}
