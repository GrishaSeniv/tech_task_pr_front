"use strict";

import { API_URL } from "./common.js";

let token = "";

async function login() {
  const login = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login, password }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    token = data.token;
    document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;
    document.getElementById("login-form").style.display = "none";
    window.location.href = "order.html";
  } else {
    console.log(response);
    const errorData = await response.json();
  }
}

window.login = login;
