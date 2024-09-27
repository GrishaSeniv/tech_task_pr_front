"use strict";

export const API_URL = "http://localhost:8080/api/v1";

export async function fetchUserInfo() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  });

  if (response.ok) {
    const userInfo = await response.json();
    console.log(userInfo);
    return userInfo;
  } else if (response.status === 401) {
    console.error("User is not authenticated");
    window.location.href = "index.html";
  } else {
    console.error("Something went wrong" + response.status);
    window.location.href = "index.html";
  }
}

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const roleAccessMap = {
  ADMIN: [
    "order.html",
    "card.html",
    "card-generation.html",
    "order-card.html",
    "report.html",
  ],
  USER: ["order.html", "client.html", "order-card.html"],
};

export function checkAccess(currentPage, roles) {
  const hasAccess = roles.some((role) =>
    roleAccessMap[role]?.includes(currentPage)
  );

  if (!hasAccess) {
    alert("Access forbidden: You do not have permission to view this page.");
    window.location.href = "index.html";
  }
}

export function renderNavMenu(roles) {
  const navList = document.querySelector(".nav__list");
  navList.innerHTML = "";

  const links = [];

  const addLink = (href, text, order) => {
    if (!links.some((link) => link.href === href)) {
      links.push({ href, text, order });
    }
  };

  roles.forEach((role) => {
    if (roleAccessMap[role]) {
      roleAccessMap[role].forEach((page, index) => {
        addLink(
          page,
          page
            .replace(".html", "")
            .replace("-", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()),
          index + 1
        );
      });
    }
  });

  links.sort((a, b) => a.order - b.order);

  links.forEach((link) => {
    const listItem = document.createElement("li");
    listItem.className = "nav__item";
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.className = "nav__link";
    anchor.textContent = link.text;
    listItem.appendChild(anchor);
    navList.appendChild(listItem);
  });

  const logoutItem = document.createElement("li");
  logoutItem.className = "nav__item";
  const logoutAnchor = document.createElement("a");
  logoutAnchor.href = "#";
  logoutAnchor.className = "nav__link";
  logoutAnchor.textContent = "Logout";
  logoutAnchor.addEventListener("click", logout);
  logoutItem.appendChild(logoutAnchor);
  navList.appendChild(logoutItem);
}

function logout() {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
