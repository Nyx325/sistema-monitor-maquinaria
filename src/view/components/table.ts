import { Record } from "@prisma/client/runtime/library";
import { Search } from "../../model/entities/Search.js";

export class Table<T extends Record<string, unknown>> {
  private readonly table: HTMLTableElement;
  private title: string = "";
  private headers: string[] = [];
  public lastSearch: Search<T> | undefined;
  public lastSelected:
    | {
        row: HTMLTableRowElement;
        record: T;
      }
    | undefined;

  private parseData: (record: T) => string[] = (record) => [String(record)];

  constructor(id: string) {
    this.table = document.getElementById(id) as HTMLTableElement;
  }

  public render(): void {
    this.table.innerHTML = "";

    const titleRow = document.createElement("tr");
    const titleCell = document.createElement("th");
    titleCell.innerText = this.title;
    titleRow.appendChild(titleCell);
    this.table.appendChild(titleRow);

    const headersRow = document.createElement("tr");
    this.headers.forEach((header) => {
      const headerCell = document.createElement("th");
      headerCell.innerText = header;
      headersRow.appendChild(headerCell);
    });
    this.table.appendChild(headersRow);

    if (this.lastSearch) {
      this.lastSearch?.result.forEach((record) => {
        const recordRow = document.createElement("tr");
        const parsedRecord = this.parseData(record);

        parsedRecord.forEach((attribute) => {
          const attributeCell = document.createElement("td");
          attributeCell.innerText = attribute;
          recordRow.appendChild(attributeCell);
        });

        // Agregar evento de clic a la fila para asignar el valor a this._lastSelected
        recordRow.addEventListener("click", () => {
          this.lastSelected?.row.classList.remove("selected-row");

          recordRow.classList.add("selected-row");

          this.lastSelected = {
            row: recordRow,
            record,
          };
        });

        this.table.appendChild(recordRow);
      });
    }
  }

  public setTitle(title: string) {
    this.title = title;
  }

  public setHeaders(headers: string[]) {
    this.headers = headers;
  }

  public onParseData(func: (record: T) => string[]) {
    this.parseData = func;
  }
}
