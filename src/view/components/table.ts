import { Search } from "../adapters/models/search.js";

export class Table {
  private readonly table: HTMLTableElement;
  private title: string = "";
  private headers: string[] = [];
  public lastSearch: Search | undefined;

  private parseData: (record: { [key: string]: unknown }) => string[] = (
    record,
  ) => {
    const keys = Object.keys(record);

    const recordParsed = [];
    for (const key of keys) {
      recordParsed.push(String(record[key]));
    }

    return recordParsed;
  };

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

    this.lastSearch?.result.forEach((record) => {
      const recordRow = document.createElement("tr");
      this.parseData(record).forEach((attribute) => {
        const attributeCell = document.createElement("td");
        attributeCell.innerText = attribute;
        recordRow.appendChild(attributeCell);
      });
      this.table.appendChild(recordRow);
    });
  }

  public setTitle(title: string) {
    this.title = title;
  }

  public setHeaders(headers: string[]) {
    this.headers = headers;
  }

  public onParseData(func: (record: { [key: string]: unknown }) => string[]) {
    this.parseData = func;
  }
}
