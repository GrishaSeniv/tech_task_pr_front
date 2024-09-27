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
  fetchOrders();
});

async function fetchOrders() {
  console.log("token=" + getCookie("token"));
  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const orders = await response.json();
    displayClients(orders);
  } else if (response.status === 401) {
    console.error("User is not authenticated");
    window.location.href = "index.html";
  } else {
    console.error("Something went wrong" + response.status);
  }
}

function displayClients(orders) {
  const ordersTableBody = document
    .getElementById("ordersTable")
    .querySelector("tbody");
  ordersTableBody.innerHTML = "";

  orders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${new Date(order.createdAt).toLocaleString()}</td>
      <td>${order.firstName}</td>
      <td>${order.lastName}</td>
      <td>${order.firstNameLat}</td>
      <td>${order.lastNameLat}</td>
      <td>${order.operatorFLN}</td>
      <td>${order.cardName}</td>
      <td>${order.cardNumber ? order.cardNumber : "N/A"}</td>
    `;
    ordersTableBody.appendChild(row);
  });
}
