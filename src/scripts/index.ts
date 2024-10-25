import Button from "../components/button.js";
import { Form } from "../components/form.js";
import Modal from "../components/modal.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = new Form({ title: "Inicio sesión" });
  form.setFields([
    { title: "Usuario", required: true },
    { title: "Correo", type: "email", required: true },
    { title: "Edad", type: "number" },
  ]);

  form.setButtons([
    { text: "Aceptar", clases: ["btn", "btn-primary"], type: "summit" },
    { id: "cancelar-btn", text: "Cancelar", clases: ["btn", "btn-danger"] },
  ]);

  form.render();

  const modal = new Modal<Form>({ content: form });

  const showModal = new Button({
    text: "Mostrar formulario",
    clases: ["btn", "btn-success"],
  });

  showModal.button.addEventListener("click", () => {
    modal.show(true);
  });

  form.getButton("cancelar-btn")?.button.addEventListener("click", () => {
    form.cleanFields();
    modal.show(false);
  });

  document.body.appendChild(showModal.container);
  document.body.appendChild(modal.container);
});
