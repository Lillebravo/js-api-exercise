import { loader, main, userHeader } from "./index.js";

const baseURL = "https://jsonplaceholder.typicode.com/";

function createUserCard(user) {
  const card = /*html*/ `
        <article class="card" id="${user.id}">
            <h3 class="name">${user.name}</h3>
            <p class="username">username: ${user.username}</p>
            <p class="phone">Phone: ${user.phone}</p>
            <p class="email">Email: ${user.email}</p>
        </article>
    `;

  return card;
}

function createUserPage(user, posts) {
  const firstName = user.name.split(" ")[0];
  const lastLetter = firstName[firstName.length - 1];

  // Check if the first name ends with one of the letters the female names ends with
  if (lastLetter === "a" || lastLetter === "e" || lastLetter === "y" || lastLetter === ".") {
    userHeader.innerHTML = "Mrs:";
  } else {
    userHeader.innerHTML = "Mr:"
  }

  const postsHtml = posts
    .map(
      (post, index) => /*html*/ `<article class="post">
    <h4 class="post-title">Post ${index + 1}: ${post.title}</h4>
    <p class="post-body">${post.body}</p>
  </article>`
    )
    .join("");

  const userPage = /*html*/ `
    <section class="user-page">
      <h3 class="name">${user.name}</h3>
      <p class="username">username: ${user.username}</p>
      <p class="phone">Phone: ${user.phone}</p>
      <p class="email">Email: ${user.email}</p>
      <div class="address">
        <p>${user.address.city}</p>
        <p>${user.address.street}</p>
      </div>
      <div class="posts">
        <h3>~Posts~</h3>
        ${postsHtml}
      </div>
      <div class="actions">
        <button id="back-btn">Back to user list</button>
      </div>
    </section>
  `;

  return userPage;
}

export async function getAllUsers() {
  // Check if users are in localStorage
  const cachedUsers = localStorage.getItem("users");
  
  if (cachedUsers) {
    // If cached, return parsed users
    return JSON.parse(cachedUsers);
  } else {
    // If not cached, fetch from API
    const res = await fetch(baseURL + "users");
    const users = await res.json();
    
    // Save to localStorage for future use
    localStorage.setItem("users", JSON.stringify(users));
    
    return users;
  }
}

async function getUserById(userId) {
  // Check if user is in localStorage
  const cachedUser = localStorage.getItem(`user_${userId}`);
  
  if (cachedUser) {
    // If cached, return parsed user
    return JSON.parse(cachedUser);
  } else {
    // If not cached, fetch from API
    const res = await fetch(baseURL + `users/${userId}`);
    const user = await res.json();
    
    // Save to localStorage for future use
    localStorage.setItem(`user_${userId}`, JSON.stringify(user));
    
    return user;
  }
}

async function getUserPosts(userId) {
  // Check if posts are in localStorage
  const cachedPosts = localStorage.getItem(`${userId}_posts`);
  
  if (cachedPosts) {
    // If cached, return parsed posts
    return JSON.parse(cachedPosts);
  } else {
    // If not cached, fetch from API
    const res = await fetch(baseURL + `users/${userId}/posts`);
    const posts = await res.json();
    
    // Save to localStorage for future use
    localStorage.setItem(`${userId}_posts`, JSON.stringify(posts));
    
    return posts;
  }
}

function handleBackButtonClick() {
  getAllUsers().then((users) => {
    insertUsersToDOM(users);
  });
}

function handleOnCardClick(card) {
  insertLoaderToDOM();
  const userId = card.id;

  Promise.all([getUserById(userId), getUserPosts(userId)]).then(
    ([user, posts]) => {
      const userPageAsHtmlString = createUserPage(user, posts);
      main.innerHTML = userPageAsHtmlString;

      const backBtn = main.querySelector("#back-btn");
      backBtn.addEventListener("click", handleBackButtonClick);
    }
  );
}

export function handleOnClick(event) {
  const { target } = event;
  const closetsCard = target.closest(".card");
  if (closetsCard) handleOnCardClick(closetsCard);
}

function insertLoaderToDOM() {
  main.innerHTML = loader.outerHTML;
}

export function insertUsersToDOM(users) {
  userHeader.innerHTML = "Users";
  const usersAsHtmlString = users.map((user) => createUserCard(user)).join("");
  main.innerHTML = usersAsHtmlString;
}
