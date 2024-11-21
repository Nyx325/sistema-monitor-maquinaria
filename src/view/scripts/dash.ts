import { AuthAdapter } from "../adapters/AuthAdapter.js";

document.addEventListener("DOMContentLoaded", () => {
  const auth = new AuthAdapter();
  if (auth.getCookie() === null) window.location.href = "/login";

  const logout = document.getElementById("logout") as HTMLButtonElement;
  logout.addEventListener("click", () => {
    console.log("Cerrando sesion");
    auth.deleteCookie();
    window.location.href = "/login";
  });
});
