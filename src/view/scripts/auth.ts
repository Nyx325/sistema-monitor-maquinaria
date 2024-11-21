import { AuthAdapter } from "../adapters/AuthAdapter.js";
import Alert from "../components/alert.js";

class LoginView {
  protected adapter: AuthAdapter = new AuthAdapter();
  protected btn: HTMLButtonElement;
  protected alert: Alert;
  protected inputs: {
    usr: HTMLInputElement;
    pwd: HTMLInputElement;
  };

  constructor() {
    this.btn = document.getElementById("login-btn") as HTMLButtonElement;
    this.alert = new Alert("login-alert");
    this.inputs = {
      usr: document.getElementById("usr-input") as HTMLInputElement,
      pwd: document.getElementById("pwd-input") as HTMLInputElement,
    };

    this.init();
  }

  init() {
    this.btn.addEventListener("click", async () => {
      const usr = this.inputs.usr.value.trim();
      const pwd = this.inputs.pwd.value.trim();
      const userData = await this.adapter.auth(usr, pwd);

      if (userData === null) {
        alert("Usuario o contraseña incorrectos");
        return;
      }

      this.adapter.setCookie(JSON.stringify(userData), 1);
      window.location.href = "/";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LoginView();
});
