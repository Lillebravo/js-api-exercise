import { getAllUsers, handleOnClick, insertUsersToDOM } from "./utilities.js";

export const loader = document.querySelector(".loader");
export const main = document.querySelector("main");

main.addEventListener("click", handleOnClick);

getAllUsers().then((users) => {
  insertUsersToDOM(users);
});