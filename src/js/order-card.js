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
  fetchCardTypes();

  document
    .getElementById("orderForm")
    .addEventListener("submit", handleOrderSubmit);
});

// Fetch clients from the backend and populate the client selection dropdown
async function fetchClients() {
  const response = await fetch(`${API_URL}/clients`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const clients = await response.json();
    const clientSelect = document.getElementById("clientSelect");
    clients.forEach((client) => {
      const option = document.createElement("option");
      option.value = client.id;
      option.textContent = `${client.firstName} ${client.lastName}`;
      clientSelect.appendChild(option);
    });
  } else {
    console.error("Failed to load clients");
  }
}

async function fetchCardTypes() {
  const response = await fetch(`${API_URL}/cards?isActive=true`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const cardTypes = await response.json();
    const cardTypeSelect = document.getElementById("cardTypeSelect");
    cardTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type.id;
      option.textContent = type.name;
      cardTypeSelect.appendChild(option);
    });
  } else {
    console.error("Failed to load card types");
  }
}

async function handleOrderSubmit(event) {
  event.preventDefault();

  const clientId = document.getElementById("clientSelect").value;
  const cardId = document.getElementById("cardTypeSelect").value;

  const orderData = {
    clientId,
    cardId,
  };

  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
    body: JSON.stringify(orderData),
  });

  if (response.ok) {
    window.location.href = "order.html";
  } else {
    console.error("Failed to place order");
    alert("Не вдалося замовити картку");
  }
}
