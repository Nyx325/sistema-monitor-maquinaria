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

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="icon icon-tabler icons-tabler-filled icon-tabler-trash-x"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z"
          />
          <path
            d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"
          />
        </svg>
      `;

      deleteBtn.setAttribute("key", String(rowData[this.keyAttribute]));
      deleteBtn.addEventListener("click", () => {
        const id = deleteBtn.getAttribute("key") as string;
        this.delete(id);
      });
      dataRow.appendChild(deleteBtn);

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
}
