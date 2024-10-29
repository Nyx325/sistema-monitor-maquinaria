import { Equipement } from "@prisma/client";
import Button from "../components/button.js";
import { Form } from "../components/form.js";
import GeneralHeader from "../components/generalHeader.js";
import Modal from "../components/modal.js";
import Table from "../components/table.js";
import { Search } from "../../model/entities/Search.js";

document.addEventListener("DOMContentLoaded", async () => {
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

  const equiposJSON = await fetch("http://localhost:3000/api/equipos", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const equipos: Search<Equipement> = JSON.parse(
    await equiposJSON.text(),
  ).search;
  console.log(equipos);

  const table = new Table();
  table.title = "Equipos";
  table.headers = ["Numero de serie", "Activo", "OEM", "Modelo"];
  table.data = equipos.result;
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
