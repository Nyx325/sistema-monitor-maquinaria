import { Record } from "@prisma/client/runtime/library";
import { Table } from "../components/table.js";
import Pager from "../components/pager.js";
import TableView from "../components/tableView.js";
import { Search } from "../../model/entities/Search.js";
import Alert from "../components/alert.js";

interface EquipmentData extends Record<string, unknown> {
  serial_number: string;
  num_errors: number;
  hours_worked: number;
  error_rate: number;
}

class Adapter {
  protected apiUrl: string;

  constructor() {
    this.apiUrl = `http://${document.location.host}/api`;
  }

  public async tasaError(
    serialNumber: string = "",
    startDate: string,
    endDate: string,
    page: number,
  ): Promise<Search<EquipmentData>> {
    const response = await fetch(
      `${this.apiUrl}/reportes/4?startDate=${startDate}&endDate=${endDate}&serialNumber=${serialNumber}&page=${page}`,
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

class Report4View implements TableView {
  protected alert: Alert;
  protected adapter: Adapter = new Adapter();
  protected startDateI: HTMLInputElement;
  protected endDateI: HTMLInputElement;
  protected serialNumberI: HTMLInputElement;
  protected summitBtn: HTMLButtonElement;
  protected table: Table<EquipmentData>;
  protected pager: Pager<EquipmentData>;

  constructor() {
    this.alert = new Alert("alert");
    this.startDateI = document.getElementById("start-date") as HTMLInputElement;
    this.endDateI = document.getElementById("end-date") as HTMLInputElement;
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
      "Número de errores",
      "Horas operarivas",
      "Tasa de errores",
      "Tasa de errores (%)",
    ]);

    this.table.onParseData((record) => {
      return [
        record.serial_number,
        `${record.num_errors ?? "no hay registros en estas fechas"}`,
        `${record.hours_worked ?? "no hay registros en estas fechas"}`,
        `${parseFloat((record.error_rate ?? 0).toFixed(4))}`,
        `${parseFloat(((record.error_rate ?? 0) * 100).toFixed(4))}`,
      ];
    });

    this.summitBtn.addEventListener("click", async () => {
      const serialNumber = this.serialNumberI.value.trim();
      const startDate = this.startDateI.value.trim();
      const endDate = this.endDateI.value.trim();

      this.table.lastSearch.criteria = {
        serialNumber,
        startDate,
        endDate,
      };

      await this.refreshTable();
    });
  }

  public async refreshTable() {
    const lastS = this.table.lastSearch;

    try {
      const search = await this.adapter.tasaError(
        lastS.criteria.serialNumber as string,
        lastS.criteria.startDate as string,
        lastS.criteria.endDate as string,
        lastS.currentPage,
      );

      this.alert.setVisible(false);

      this.table.lastSearch = search;
      this.table.render();
      this.pager.render();
    } catch (e) {
      if (e instanceof Error) {
        this.alert.setMessage(e.message);
        this.alert.setVisible(true);
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Report4View();
});
