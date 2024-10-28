import Button from "../components/button.js";
import { Form } from "../components/form.js";
import GeneralHeader from "../components/generalHeader.js";
import Modal from "../components/modal.js";
import Table from "../components/table.js";

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

  const header = new GeneralHeader();

  const table = new Table();
  table.title = "Prueba";
  table.headers = ["Uno", "Dos", "Tres"];
  table.data = [
    { uno: 1, dos: 2.3, tres: "Cosa" },
    { tres: "A", cuatro: 1, cinco: 1.3, seis: "A" },
  ];
  table.container.classList.add("table");

  Promise.all([
    form.render(),
    modal.render(),
    header.render(),
    table.render(),
  ]).then();

  document.body.appendChild(header.container);
  document.body.appendChild(showModal.container);
  document.body.appendChild(modal.container);
  document.body.appendChild(table.container);
});
