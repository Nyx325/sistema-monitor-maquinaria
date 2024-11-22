import { Record } from "@prisma/client/runtime/library";
import { Table } from "../components/table.js";
import Pager from "../components/pager.js";
import TableView from "../components/tableView.js";
import { Search } from "../../model/entities/Search.js";

interface EquipmentData extends Record<string, unknown> {
  equipo: string;
  combustible_usado_acumulado: number;
  horas_operativas_acumuladas: number;
  combustible_por_hora: number;
}

class Adapter {
  protected apiUrl: string;

  constructor() {
    this.apiUrl = `http://${document.location.host}/api`;
  }

  public async proporcionPorEquipo(
    serialNumber: string,
    page: number,
  ): Promise<Search<EquipmentData>> {
    const response = await fetch(
      `${this.apiUrl}/reportes/3?serialNumber=${serialNumber}&page=${page}`,
    );

    if (response.status >= 400) {
      const error = await response.json();
      throw Error(error.message);
    }

    const res = await response.json();
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
      "Combustible usado acumulado",
      "Horas operativas acumuladas",
      "Combustible por hora",
    ]);

    this.table.onParseData((record) => {
      return [
        record.equipo,
        `${record.combustible_usado_acumulado}`,
        `${record.horas_operativas_acumuladas}`,
        `${parseFloat(record.combustible_por_hora.toFixed(4))}`,
      ];
    });

    this.summitBtn.addEventListener("click", async () => {
      const sN = this.serialNumberI.value.trim();
      this.table.lastSearch.criteria.equipo = sN;

      await this.refreshTable();
    });

    this.refreshTable().then();
  }

  public async refreshTable() {
    const lastS = this.table.lastSearch;

    const search = await this.adapter.proporcionPorEquipo(
      lastS.criteria.equipo ?? "",
      lastS.currentPage,
    );

    this.table.lastSearch = search;
    this.table.render();
    this.pager.render();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Report2View();
});
