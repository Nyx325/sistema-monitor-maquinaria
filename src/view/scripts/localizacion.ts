import { Location} from "@prisma/client";
import { Search } from "../../model/entities/Search.js";
import Table from "../components/table.js";
import { Form } from "../components/form.js";
import Modal from "../components/modal.js";
import Button from "../components/button.js";

document.addEventListener("DOMContentLoaded", async () => {
    const form = new Form({ title: "" });
  
    form.setFields([
      { id: "latitude", title: "Latitud", required: true },
      { id: "longitude", title: "Longitud", required: true },
      { id: "altitud", title: "Altitud", required: true },
      { id: "altitud_units", title: "Unidades de altitud", required: true },
      { id: "china_cord", title: "Cordenadas Chinas", required: true },
      { id: "date", title: "fecha", required: true },
    ]);
  
    form.setButtons([
      { text: "Aceptar", clases: ["btn", "btn-primary"], id: "aceptar-btn" },
      { text: "Cancelar", clases: ["btn", "btn-danger"], id: "cancelar-btn" },
    ]);
  
    const modal = new Modal<Form>({ content: form });
  
    const showModal = new Button({ text: "Agregar localización" });
    showModal.button.addEventListener("click", () => {
      form.title = "Agregar una localización";
      modal.show(true);
    });
  
    form.getButton("cancelar-btn")?.button.addEventListener("click", () => {
      form.cleanFields();
      modal.show(false);
    });
  
    const table = new Table({ title: "Localizaciones" });
    table.headers = ["Localizacion ID", "Latitud", "Longitud", "Altitud","Unidades de altitud","Cordenadas chinas","fecha"];
  
    // Solcitas datos a la API
    const solicitud = await fetch(
      "http://localhost/api/location?active=true",
    );
  
    // Conviertes la solicitud a texto plano, y de formato JSON lo pasas
    // a un objeto de tipo Search
    const busqueda: Search<Location> = JSON.parse(await solicitud.text());
  
    // Asignas el resultado de la busqueda a la tabla
    table.setData("localizacion_id", busqueda.result);
  
    table.deleteEvent(async (id) => {
      const response = await fetch(`http://localhost/api/location/${id}`, {
        method: "DELETE",
      });
  
      if (response.status >= 400) {
        const res = JSON.parse(await response.text());
        console.error(res);
      } else {
        const res = await fetch(`http://localhost/api/location?active=true`);
        const search: Search<Location> = JSON.parse(await res.text());
        table.setData("localizacion_id", search.result);
        table.render();
      }
    });
  
    table.modifyEvent(async (id) => {
      const response = await fetch(`http://localhost:3000/api/location/${id}`);
      if (response.status >= 400) {
        const res = JSON.parse(await response.text());
        console.error(res);
        return;
      }
  
      const equipement: Location = JSON.parse(await response.text());
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
  