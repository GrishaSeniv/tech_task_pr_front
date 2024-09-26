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
  const generateCardsButton = document.getElementById("generateCardsButton");

  generateCardsButton.addEventListener("click", handleFormSubmit);
});

async function handleFormSubmit(event) {
  try {
    const response = await fetch(`${API_URL}/orders/generate-card-numbers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });

    if (response.ok) {
      console.log("Card numbers generated successfully!");
      window.location.href = "order.html";
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
}
