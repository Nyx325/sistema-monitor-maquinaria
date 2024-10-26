import Component from "./component.js";

export interface TableOptions {
  id?: string;
  title: string;
  headers: string[];
}

export default class Table extends Component {
  protected table: HTMLTableElement;
  protected title: string;
  protected headersCaption: string[];
  public data: { [key: string]: unknown }[] = [];

  constructor(opts: TableOptions) {
    super();
    this.table = document.createElement("table");
    this.headersCaption = opts.headers;
    this.title = opts.title;
  }

  render(): void {
    this.table.innerHTML = "";

    const title = document.createElement("tr");
    const titleCell = document.createElement("th");
    titleCell.innerText = this.title;
    title.appendChild(titleCell);
    this.table.appendChild(title);

    const headers = document.createElement("tr");
    this.headersCaption.forEach((header) => {
      const cell = document.createElement("th");
      cell.innerText = header;
      headers.appendChild(cell);
    });
    this.table.appendChild(headers);

    this.data.forEach((rowData) => {
      const dataRow = document.createElement("tr");

      Object.keys(rowData).forEach((key) => {
        const cell = document.createElement("td");
        cell.innerText = String(rowData[key]);
        dataRow.appendChild(cell);
      });

      this.table.appendChild(dataRow);
    });
  }

  get container(): HTMLElement {
    return this.table;
  }
}

