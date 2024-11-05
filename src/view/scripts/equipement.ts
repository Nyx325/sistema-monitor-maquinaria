import Modal from "../components/modal.js";
import { Table } from "../components/table.js";
import EquipementAdapter from "../adapters/infraestructure/EquipementAdapter.js";
import { IEquipementAdapter } from "../adapters/use_cases/IEquipementAdapter.js";
import Alert from "../components/alert.js";
import { Search } from "../adapters/models/search.js";

document.addEventListener("DOMContentLoaded", async () => {
  // DECLARACION DE VARIABLES ""GLOBALES""
  const adapter: IEquipementAdapter = new EquipementAdapter();
  const serialNInput = document.getElementById(
    "serial-number-input",
  ) as HTMLInputElement;

  const modelInput = document.getElementById("model-input") as HTMLInputElement;
  const oemInput = document.getElementById("oem-input") as HTMLInputElement;

  const addBtn = document.getElementById("add-equipement") as HTMLButtonElement;
  const aceptBtn = document.getElementById("acept-btn") as HTMLButtonElement;
  const cancelBtn = document.getElementById("cancel-btn") as HTMLButtonElement;
  const modal = new Modal("equipement-modal");

  const alert = new Alert("equipement-alert");
  const table = new Table("equipement-records");

  let adding = false;

  // DECLARACION DE FUNCIONES
  async function initTable(): Promise<void> {
    table.setTitle("Equipos");
    table.setHeaders(["Numero de serie", "OEM", "Modelo"]);

    const response = await adapter.getBy({ active: true }, 1);

    const search: Search = JSON.parse(await response.text());

    table.onParseData((record) => {
      return [
        String(record.serial_number),
        String(record.oem_name),
        String(record.model),
      ];
    });

    table.onGetRecordId((record) => {
      return String(record.serial_number);
    });

    table.lastSearch = search;
    console.log(search);
    console.log(table.lastSearch);
    table.render();
  }

  function initModal() {
    addBtn.addEventListener("click", () => {
      adding = true;
      modal.show(true);
    });

    cancelBtn.addEventListener("click", () => {
      modal.show(false);
    });
  }

  function initForm() {
    aceptBtn.addEventListener("click", async () => {
      const serial_number = serialNInput.value.trim();
      const oem_name = oemInput.value.trim();
      const model = modelInput.value.trim();

      let response;
      if (adding) {
        response = await adapter.add({
          serial_number,
          model,
          oem_name,
          active: true,
        });
        adding = false;
      } else {
        response = await adapter.add({
          serial_number,
          model,
          oem_name,
          active: true,
        });
      }

      if (response.status >= 400) {
        const res = JSON.parse(await response.text());
        alert.setMessage(res.message);
        alert.setVisible(true);
      } else {
        adding = false;
        modal.show(false);

        const reload = await adapter.getBy(
          table.lastSearch?.criteria ?? {},
          table.lastSearch?.currentPage ?? 1,
        );

        if (reload.status >= 400) {
          const res = JSON.parse(await response.text());
          console.error(res.message);

          table.lastSearch = {
            currentPage: 1,
            totalPages: 1,
            result: [],
            criteria: {},
          };
        } else {
          const search: Search = JSON.parse(await reload.text());
          table.lastSearch = search;
        }

        table.render();
      }
    });
  }

  // LLAMADO A TODAS LAS FUNCIONES DE INICIALIZACION
  initTable().then();
  initModal();
  initForm();
});
