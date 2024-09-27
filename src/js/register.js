"use strict";

import { API_URL } from "./common.js";

async function register() {
  const login = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const firstName = document.getElementById("firstName").value;
  const surname = document.getElementById("surname").value;
  const lastName = document.getElementById("lastName").value;

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ login, password, firstName, surname, lastName }),
  });

  if (response.ok) {
    console.log("User succsessully registered with login" + login);
    window.location.href = "index.html";
  } else {
    const errorData = await response.json();
    console.error("Something went wrong while registering user", errorData);
  }
}

window.register = register;
