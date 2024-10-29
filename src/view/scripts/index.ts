import { Equipement } from "@prisma/client";
import { Search } from "../../model/entities/Search.js";
import Table from "../components/table.js";

document.addEventListener("DOMContentLoaded", async () => {
  const table = new Table({ title: "Equipos" });

  // Solcitas datos a la API
  const solicitud = await fetch("http://localhost:3000/api/equipos");

  // Conviertes la solicitud a texto plano, y de formato JSON lo pasas
  // a un objeto de tipo Search
  const busqueda: Search<Equipement> = JSON.parse(await solicitud.text());

  // Asignas el resultado de la busqueda a la tabla
  table.setData("serial_number", busqueda.result);

  table.deleteEvent(async (id) => {
    const response = await fetch(`http://localhost:3000/api/equipos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status >= 400) {
      const res = JSON.parse(await response.text());
      console.error(res);
    } else {
      const res = await fetch(`http://localhost:3000/api/equipos`);
      const search: Search<Equipement> = JSON.parse(await res.text());
      table.setData("serial_number", search.result);
      table.render();
    }
  });

  // Dibujas y colocas la tabla en el HTML
  table.render();
  document.body.appendChild(table.container);
});
