import { NewEquipement } from "../../model/repository/use_cases/EquipementRepository.js";
import { Form } from "../components/form.js";
import LabeledInput from "../components/labeledInput.js";

document.addEventListener("DOMContentLoaded", async () => {
  const form = new Form({ title: "Form" });
  form.setFields([
    { id: "nums", title: "Numero de serie", required: true },
    { id: "modelo", title: "Modelo", required: true },
    { id: "oem", title: "OEM", required: true },
  ]);

  form.setButtons([{ id: "crear-btn", text: "Crear equipo", type: "submit" }]);

  const btnCrear = form.getButton("crear-btn");

  btnCrear?.button.addEventListener("click", async (event) => {
    //Evito que el formulario mande el método POST
    event.preventDefault();

    /* getField devuelve un LabeledInput o undefined, con
     * as LabeledInput forzamos el tipo
     */
    const nums = form.getField("nums") as LabeledInput;
    const modelo = form.getField("modelo") as LabeledInput;
    const oem = form.getField("oem") as LabeledInput;

    const nuevoEquipo: NewEquipement = {
      serial_number: nums?.input.value.trim(),
      model: modelo?.input.value.trim(),
      oem_name: oem?.input.value.trim(),
    };

    const response = await fetch("http://localhost:3000/api/equipos", {
      // Metodo a usar, GET, PUT, POST, DELETE
      method: "POST",
      headers: {
        // indicar que mandamos el cuerpo en
        // formato JSON
        "Content-Type": "application/json",
      },
      // Formatear el objeto en texto para
      // la solicitud
      body: JSON.stringify(nuevoEquipo),
    });

    if (response.status >= 400) {
      const error = JSON.parse(await response.text());
      form.alert.message = error.message;
      form.alert.visible = true;
    } else {
      console.log("to bien");
      form.alert.visible = false;
    }
  });

  form.render();
  document.body.appendChild(form.container);
});
