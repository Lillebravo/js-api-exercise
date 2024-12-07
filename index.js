import { getAllUsers, handleOnClick, insertUsersToDOM } from "./utilities.js";

export const loader = document.querySelector(".loader");
export const main = document.querySelector("main");
export const userHeader = document.querySelector("h1");

main.addEventListener("click", handleOnClick);

getAllUsers().then((users) => {
  insertUsersToDOM(users);
});