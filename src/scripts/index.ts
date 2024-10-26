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

  const header = new GeneralHeader();
  header.render();

  const table = new Table({
    title: "Prueba",
    headers: ["Columna 1", "Columna 2", "Columna 3"],
  });

  table.data = [
    { uno: 1, dos: 2.3, tres: "Cosa" },
    { tres: "A", cuatro: 1, cinco: 1.3, seis: "A" },
  ];

  table.render();

  document.body.appendChild(header.container);
  document.body.appendChild(showModal.container);
  document.body.appendChild(modal.container);
  document.body.appendChild(table.container);
});
