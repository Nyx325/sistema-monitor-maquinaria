import { Search } from "../../model/entities/Search.js";
import Component from "./component.js";

/**
 * Opciones de configuración para el componente `Table`.
 */
export interface TableOptions {
  /** Identificador único de la tabla (opcional). */
  id?: string;
  /** Título de la tabla que se mostrará en la cabecera. (opcional) */
  title?: string;
  /** Array de cadenas que representa los encabezados de la tabla (opcional). */
  headers?: string[];
}

/**
 * Clase `Table` que representa una tabla HTML que puede contener datos dinámicos.
 * Hereda de la clase base `Component`.
 */
export default class Table extends Component {
  /** Elemento HTML que representa la tabla. */
  protected table: HTMLTableElement;

  /** Título de la tabla. */
  public title: string = "";

  /** Encabezados de la tabla. */
  public headers: string[] = [];

  /** Datos que se mostrarán en la tabla. */
  private data: { [key: string]: unknown }[] = [];

  private keyAttribute: string;

  private delete: (id: string) => void;

  private update: (id: string) => void;

  public lastSearch: Search<unknown>;

  /**
   * Crea una nueva instancia de `Table` con las opciones especificadas.
   *
   * @param opts - Opciones de configuración que incluyen el id, título y encabezados de la tabla.
   */
  constructor(opts: TableOptions = {}) {
    super();
    this.table = document.createElement("table");
    if (opts.title !== undefined) this.title = opts.title; // Asigna el título si se proporciona.
    if (opts.headers !== undefined) this.headers = opts.headers; // Asigna los encabezados si se proporcionan.
    this.keyAttribute = "";
    this.table.classList.add("table", "table-striped", "container");

    this.lastSearch = {
      currentPage: 1,
      totalPages: 1,
      criteria: {},
      result: [],
    };
    this.delete = async () => {};
    this.update = async () => {};
  }

  /**
   * Renderiza la tabla en el DOM.
   * Crea la estructura HTML de la tabla, incluyendo el título, encabezados y filas de datos.
   */
  render(): void {
    this.table.innerHTML = ""; // Limpia el contenido existente de la tabla.

    // Crea una fila para el título de la tabla
    const titleRow = document.createElement("tr");
    const titleCell = document.createElement("th");
    titleCell.innerText = this.title; // Establece el texto del título
    titleCell.colSpan = this.headers.length; // Hacer que el título ocupe todas las columnas
    titleRow.appendChild(titleCell);
    this.table.appendChild(titleRow); // Agrega la fila del título a la tabla

    // Crea una fila para los encabezados de la tabla
    const headerRow = document.createElement("tr");
    this.headers.forEach((header) => {
      const cell = document.createElement("th");
      cell.innerText = header; // Establece el texto del encabezado
      headerRow.appendChild(cell);
    });
    this.table.appendChild(headerRow); // Agrega la fila de encabezados a la tabla

    // Crea filas para los datos
    this.data.forEach((rowData) => {
      const dataRow = document.createElement("tr");

      Object.keys(rowData).forEach((key) => {
        const cell = document.createElement("td");
        cell.innerText = String(rowData[key]); // Convierte el dato a texto y lo establece en la celda
        dataRow.appendChild(cell);
      });

      let td = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("btn", "btn-danger", "mb-1");
      deleteBtn.innerHTML = `<i class="fa fa-trash"></i>`;

      deleteBtn.setAttribute("key", String(rowData[this.keyAttribute]));
      deleteBtn.addEventListener("click", () => {
        const id = deleteBtn.getAttribute("key") as string;
        this.delete(id);
      });

      td.appendChild(deleteBtn);
      dataRow.appendChild(td);

      td = document.createElement("td");
      const modifyBtn = document.createElement("button");
      modifyBtn.classList.add("btn", "btn-primary", "mb-1");
      modifyBtn.innerHTML = '<i class="fa fa-pencil"></i>';
      modifyBtn.setAttribute("key", String(rowData[this.keyAttribute]));
      modifyBtn.addEventListener("click", () => {
        const id = deleteBtn.getAttribute("key") as string;
        this.update(id);
      });
      td.appendChild(modifyBtn);
      dataRow.appendChild(td);

      this.table.appendChild(dataRow); // Agrega la fila de datos a la tabla
    });
  }

  /**
   * Obtiene el contenedor de la tabla.
   *
   * @returns El elemento HTML que representa la tabla.
   */
  get container(): HTMLElement {
    return this.table; // Retorna el elemento de la tabla
  }

  public setData(keyAttribute: string, data: { [key: string]: unknown }[]) {
    this.data = data;
    this.keyAttribute = keyAttribute;
  }

  public deleteEvent(func: (id: string) => void) {
    this.delete = func;
  }

  public modifyEvent(func: (id: string) => void) {
    this.update = func;
  }
}
