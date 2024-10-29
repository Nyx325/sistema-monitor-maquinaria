import { Equipement } from "@prisma/client";
import { Search } from "../../model/entities/Search.js";
import Table from "../components/table.js";
import { Form } from "../components/form.js";
import Modal from "../components/modal.js";
import Button from "../components/button.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = new Form({ title: "" });

  form.setFields([
    { title: "Numero de serie", required: true },
    { title: "OEM", required: true },
    { title: "Modelo", required: true },
  ]);

  form.setButtons([
    { text: "Aceptar", clases: ["btn", "btn-primary"], id: "aceptar-btn" },
    { text: "Cancelar", clases: ["btn", "btn-danger"], id: "cancelar-btn" },
  ]);

  const modal = new Modal<Form>({ content: form });

  const showModal = new Button({ text: "Agregar equipo" });
  showModal.button.addEventListener("click", () => {
    form.title = "Agregar un equipo";
    modal.show(true);
  });

  form.getButton("cancelar-btn")?.button.addEventListener("click", () => {
    form.cleanFields();
    modal.show(false);
  });

  const table = new Table({ title: "Equipos" });
  table.headers = ["Numero de serie", "Activo", "OEM", "Model"];

  // Solcitas datos a la API
  const solicitud = await fetch(
    "http://localhost:3000/api/equipos?active=true",
  );

  // Conviertes la solicitud a texto plano, y de formato JSON lo pasas
  // a un objeto de tipo Search
  const busqueda: Search<Equipement> = JSON.parse(await solicitud.text());

  // Asignas el resultado de la busqueda a la tabla
  table.setData("serial_number", busqueda.result);

  table.deleteEvent(async (id) => {
    const response = await fetch(`http://localhost:3000/api/equipos/${id}`, {
      method: "DELETE",
    });

    if (response.status >= 400) {
      const res = JSON.parse(await response.text());
      console.error(res);
    } else {
      const res = await fetch(`http://localhost:3000/api/equipos?active=true`);
      const search: Search<Equipement> = JSON.parse(await res.text());
      table.setData("serial_number", search.result);
      table.render();
    }
  });

  table.modifyEvent(async (id) => {
    const response = await fetch(`http://localhost:3000/api/equipos/${id}`);
    if (response.status >= 400) {
      const res = JSON.parse(await response.text());
      console.error(res);
      return;
    }

    const equipement: Equipement = JSON.parse(await response.text());
    console.log(equipement);
  });

  // Dibujas y colocas la tabla en el HTML
  modal.render();
  table.render();
  showModal.render();
  document.body.appendChild(showModal.container);
  document.body.appendChild(modal.container);
  document.body.appendChild(table.container);
});
