import { loader, main } from "./index.js";

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
  const res = await fetch(baseURL + "/users");
  const users = await res.json();
  return users;
}

async function getUserById(userId) {
  const res = await fetch(baseURL + `/users/${userId}`);
  const user = await res.json();
  return user;
}

async function getUserPosts(userId) {
  const res = await fetch(baseURL + `/users/${userId}/posts`);
  const posts = await res.json();
  return posts;
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
  const usersAsHtmlString = users.map((user) => createUserCard(user)).join("");
  main.innerHTML = usersAsHtmlString;
}
