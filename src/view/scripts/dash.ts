import { UserData } from "../../model/entities/UserData.js";
import { AuthAdapter } from "../adapters/AuthAdapter.js";

class Dashboard {
  protected auth: AuthAdapter;
  protected manager: HTMLElement;
  protected analyst: HTMLElement;
  protected admin: HTMLElement;
  protected logoutBtn: HTMLButtonElement;

  constructor() {
    this.auth = new AuthAdapter();
    this.manager = document.getElementById("manager-section") as HTMLElement;
    this.analyst = document.getElementById("analyst-section") as HTMLElement;
    this.admin = document.getElementById("admin-section") as HTMLElement;
    this.logoutBtn = document.getElementById("logout") as HTMLButtonElement;

    this.init();
    this.render();
  }

  render() {
    try {
      const cookie = this.auth.getCookie();

      if (cookie === null) {
        window.location.href = "/login";
        throw Error("User must be logged");
      }
      const usr: UserData = JSON.parse(cookie);

      const keys = Object.keys(usr) as Array<keyof UserData>;
      for (const key of keys) {
        if (usr[key] === undefined) {
          this.logout();
          throw Error("Corrupted cookie");
        }
      }
      this.analyst.style.display = "none";
      this.manager.style.display = "none";
      this.admin.style.display = "none";

      if (usr.user_type === "ANALIST" || usr.user_type === "ADMIN")
        this.analyst.style.display = "flex";
      if (usr.user_type === "MANAGER" || usr.user_type === "ADMIN")
        this.manager.style.display = "flex";
      if (usr.user_type === "ADMIN") this.admin.style.display = "flex";
    } catch (error) {
      console.error(error);
      this.logout();
    }
  }

  init() {
    this.logoutBtn.addEventListener("click", () => this.logout());
  }

  private logout() {
    this.auth.deleteCookie();
    window.location.href = "/login";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Dashboard();
});
