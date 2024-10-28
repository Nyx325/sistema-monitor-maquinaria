import { Form } from "../components/form.js";
import GeneralHeader from "../components/generalHeader.js";

document.addEventListener("DOMContentLoaded", () => {
  const header = new GeneralHeader();

  const form = new Form({ id: "login-form", title: "Iniciar sesión" });

  form.setFields([
    { id: "username", title: "Usuario", required: true },
    { id: "password", title: "Contraseña", type: "password", required: true },
  ]);

  form.setButtons([
    {
      id: "sign-in-btn",
      type: "button",
      text: "Iniciar sesión",
      clases: ["btn", "btn-primary"],
    },
  ]);

  header.render();
  form.render();

  document.body.appendChild(header.container);
  document.body.appendChild(form.container);

  form.getButton("sign-in-btn")?.button.addEventListener("click", () => {
    console.log("Iniciando sesión");
  });
});
