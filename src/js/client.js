"use strict";

import {
  getCookie,
  fetchUserInfo,
  renderNavMenu,
  checkAccess,
  API_URL,
} from "./common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const userInfo = await fetchUserInfo();
  checkAccess(window.location.pathname.split("/").pop(), userInfo.roles);
  renderNavMenu(userInfo.roles);
  fetchClients();
  document.getElementById("addClientBtn").addEventListener("click", openModal);
  document
    .getElementById("clientForm")
    .addEventListener("submit", handleFormSubmit);
  document.querySelector(".close-button").addEventListener("click", closeModal);
});

async function fetchClients() {
  const response = await fetch(`${API_URL}/clients`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const clients = await response.json();
    displayClients(clients);
  } else {
    console.error("Failed to fetch clients", response.status);
  }
}

function displayClients(clients) {
  const clientsTableBody = document.querySelector("#displayClients tbody");
  clientsTableBody.innerHTML = "";

  clients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${client.id}</td>
            <td>${client.lastName}</td>
            <td>${client.firstName}</td>
            <td>${client.lastNameLat}</td>
            <td>${client.firstNameLat}</td>
            <td>${new Date(client.birthday).toLocaleDateString()}</td>
            <td>${client.phone}</td>
            <td>${client.email}</td>
            <td>${client.operatorFLN}</td>
            <td>
                <button class="edit-button" data-id="${
                  client.id
                }">Редагувати</button>
            </td>
        `;
    clientsTableBody.appendChild(row);
  });

  // Add event listeners to edit buttons
  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", () => openEditModal(button.dataset.id));
  });
}

function openModal() {
  document.getElementById("modalTitle").innerText = "Додати клієнта";
  document.getElementById("clientForm").reset();
  document.getElementById("clientId").value = "";
  document.getElementById("clientModal").style.display = "block";
}

async function openEditModal(clientId) {
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const client = await response.json();
    document.getElementById("modalTitle").innerText = "Редагувати клієнта";
    document.getElementById("clientId").value = client.id;
    document.getElementById("lastName").value = client.lastName;
    document.getElementById("firstName").value = client.firstName;
    document.getElementById("lastNameLat").value = client.lastNameLat;
    document.getElementById("firstNameLat").value = client.firstNameLat;
    document.getElementById("birthday").value = client.birthday.split("T")[0];
    document.getElementById("phone").value = client.phone;
    document.getElementById("email").value = client.email;
    document.getElementById("clientModal").style.display = "block";
  } else {
    console.error("Failed to fetch client", response.status);
  }
}

// Handle form submission for adding/editing clients
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  const clientData = {
    id: document.getElementById("clientId").value,
    lastName: document.getElementById("lastName").value,
    firstName: document.getElementById("firstName").value,
    lastNameLat: document.getElementById("lastNameLat").value,
    firstNameLat: document.getElementById("firstNameLat").value,
    birthday: document.getElementById("birthday").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
  };

  const method = clientData.id ? "PATCH" : "POST";

  const response = await fetch(
    `${API_URL}/clients${clientData.id ? `/${clientData.id}` : ""}`,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(clientData),
    }
  );

  if (response.ok) {
    fetchClients();
    closeModal();
  } else {
    console.error("Failed to save client", response.status);
  }
}

function closeModal() {
  document.getElementById("clientModal").style.display = "none";
}
