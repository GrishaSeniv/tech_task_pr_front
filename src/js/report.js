"use strict";

import { getCookie } from "./common.js";
import { fetchUserInfo } from "./common.js";
import { checkAccess } from "./common.js";
import { renderNavMenu } from "./common.js";
import { API_URL } from "./common.js";

document.addEventListener("DOMContentLoaded", async () => {
  const userInfo = await fetchUserInfo();
  checkAccess(window.location.pathname.split("/").pop(), userInfo.roles);
  renderNavMenu(userInfo.roles);
  const data = await fetchReport();
  displayTotalClients(data);
  displayTotalOrders(data);
  displayLeaderboard(data);
  document
    .getElementById("exportCsvBtn")
    .addEventListener("click", exportToCSV);
});

async function fetchReport() {
  const response = await fetch(`${API_URL}/reports/generate`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const report = await response.json();
    console.log("Successfullt fetched report", report);
    return report;
  } else if (response.status === 401) {
    console.error("User is not authenticated");
    window.location.href = "index.html";
  } else {
    console.error("Something went wrong" + response.status);
    window.location.href = "index.html";
  }
}

async function displayTotalClients(data) {
  const clientsTableBody = document
    .getElementById("totalClients")
    .querySelector("tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
  <td>${data.clientCount}</td>
`;
  clientsTableBody.appendChild(row);
}

async function displayTotalOrders(data) {
  const clientsTableBody = document
    .getElementById("totalOrders")
    .querySelector("tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
<td>${data.orderCount}</td>
`;
  clientsTableBody.appendChild(row);
}

async function displayLeaderboard(data) {
  const leaderboardTableBody = document
    .getElementById("leaderboard")
    .querySelector("tbody");

  const leaderboard = data.operatorReports;
  leaderboard.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.operatorLogin}</td>
      <td>${user.operatorFLN}</td>
      <td>${user.operatorOrderCount}</td>
    `;
    leaderboardTableBody.appendChild(row);
  });
}

async function exportToCSV() {
  const response = await fetch(`${API_URL}/reports/export`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const report = await response.text();
    const blob = new Blob([report], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Successfullt exported report", report);
    return report;
  } else if (response.status === 401) {
    console.error("User is not authenticated");
    window.location.href = "index.html";
  } else {
    console.error("Something went wrong" + response.status);
    window.location.href = "index.html";
  }
}
