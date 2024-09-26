"use strict";

import { API_URL } from "./common.js";

let token = "";

async function login() {
  const login = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  errorMessage.style.display = "none";
  errorMessage.textContent = "";

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
    console.log("User succsessully logged-in");
    window.location.href = "order.html";
  } else if (response.status === 401) {
    errorMessage.style.display = "block";
    const errMsg = "Неправильний логін або пароль";
    errorMessage.textContent = errMsg;
    console.error(errMsg);
  } else {
    const errorData = await response.json();
    console.error("Something went wrong", errorData);
  }
}

window.login = login;
