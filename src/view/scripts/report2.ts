import { Record } from "@prisma/client/runtime/library";
import { Table } from "../components/table.js";
import Pager from "../components/pager.js";
import TableView from "../components/tableView.js";
import { Search } from "../../model/entities/Search.js";

interface EquipmentData extends Record<string, unknown> {
  serial_number: string;
  horasInactivas: number;
  horasOperativas: number;
  proporcionInactiva: number | null;
}

class Adapter {
  protected apiUrl: string;

  constructor() {
    this.apiUrl = `http://${document.location.host}/api`;
  }

  public async getData(
    serialNumber: string,
    page: number,
  ): Promise<Search<EquipmentData>> {
    const response = await fetch(
      `${this.apiUrl}/reportes/2?serialNumber=${serialNumber}&page=${page}`,
    );

    if (response.status >= 400) {
      const error = await response.json();
      throw Error(error.message);
    }

    const res = await response.json();
    console.log(res); // Verificar que los datos sean correctos
    return {
      ...res,
      result: res.result.flat(), // Aplana el resultado si es un array de arrays
    };
  }
}

class Report2View implements TableView {
  protected adapter: Adapter = new Adapter();
  protected serialNumberI: HTMLInputElement;
  protected summitBtn: HTMLButtonElement;
  protected table: Table<EquipmentData>;
  protected pager: Pager<EquipmentData>;

  constructor() {
    this.serialNumberI = document.getElementById(
      "serial-number",
    ) as HTMLInputElement;

    this.summitBtn = document.getElementById("summit-btn") as HTMLButtonElement;
    this.table = new Table("table");
    this.pager = new Pager({
      table: this.table,
      view: this,
      maxBtns: 5,
      container: "pager",
    });

    this.init();
  }

  public init() {
    this.table.setTitle("Proporción de tiempo inactivo");
    this.table.setHeaders([
      "Número de serie",
      "Horas inactivas",
      "Horas operativas",
      "Proporción",
      "Proporción (%)",
    ]);

    this.table.onParseData((record) => {
      const proporcionInactiva = record.proporcionInactiva ?? 0;
      const proporcionPorciento = (proporcionInactiva * 100).toFixed(2); // Redondear a 2 decimales

      return [
        record.serial_number,
        `${record.horasInactivas}`,
        `${record.horasOperativas}`,
        `${proporcionInactiva}`,
        `${proporcionPorciento}`, // Mostrar la proporción redondeada
      ];
    });

    this.summitBtn.addEventListener("click", async () => {
      const sN = this.serialNumberI.value.trim();
      this.table.lastSearch.criteria.serial_number = sN;

      await this.refreshTable();
    });

    this.refreshTable().then();
  }

  public async refreshTable() {
    const lastS = this.table.lastSearch;

    const search = await this.adapter.getData(
      lastS.criteria.serial_number ?? "",
      lastS.currentPage,
    );

    this.table.lastSearch = search; // Actualizar los datos de la tabla
    this.table.render(); // Renderizar la tabla con los nuevos datos
    this.pager.render(); // Renderizar el paginador también
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Report2View();
});
