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
  fetchCards();
  document.getElementById("addCardBtn").addEventListener("click", openModal);
  document
    .getElementById("cardModal")
    .addEventListener("submit", handleFormSubmit);
  document.querySelector(".close-button").addEventListener("click", closeModal);
});

async function fetchCards() {
  const response = await fetch(`${API_URL}/cards`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const cards = await response.json();
    displayCards(cards);
  } else {
    console.error("Failed to fetch cards", response.status);
  }
}

function displayCards(cards) {
  const cardsTableBody = document.querySelector("#displayCards tbody");
  cardsTableBody.innerHTML = "";

  cards.forEach((card) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${card.id}</td>
            <td>${card.name}</td>
            <td>${card.bin}</td>
            <td>${card.isActive}</td>
            <td>${card.operatorFLN}</td>
            <td>
                <button class="edit-button" data-id="${card.id}">Редагувати</button>
            </td>
        `;
    cardsTableBody.appendChild(row);
  });

  // Add event listeners to edit buttons
  document.querySelectorAll(".edit-button").forEach((button) => {
    button.addEventListener("click", () => openEditModal(button.dataset.id));
  });
}

function openModal() {
  document.getElementById("modalTitle").innerText = "Додати карту";
  document.getElementById("cardForm").reset();
  document.getElementById("cardId").value = "";
  document.getElementById("cardModal").style.display = "block";
}

async function openEditModal(cardId) {
  const response = await fetch(`${API_URL}/cards/${cardId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const card = await response.json();
    document.getElementById("modalTitle").innerText = "Редагувати карту";
    document.getElementById("cardId").value = card.id;
    document.getElementById("name").value = card.name;
    document.getElementById("bin").value = card.bin;
    document.getElementById("isActive").value = card.isActive;
    document.getElementById("cardModal").style.display = "block";
  } else {
    console.error("Failed to fetch card", response.status);
  }
}

// Handle form submission for adding/editing cards
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission

  const cardData = {
    id: document.getElementById("cardId").value,
    name: document.getElementById("name").value,
    bin: document.getElementById("bin").value,
    isActive: document.getElementById("isActive").value,
  };

  const method = cardData.id ? "PATCH" : "POST";

  const response = await fetch(
    `${API_URL}/cards${cardData.id ? `/${cardData.id}` : ""}`,
    {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      body: JSON.stringify(cardData),
    }
  );

  if (response.ok) {
    fetchCards();
    closeModal();
  } else {
    console.error("Failed to save card", response.status);
  }
}

function closeModal() {
  document.getElementById("cardModal").style.display = "none";
}
