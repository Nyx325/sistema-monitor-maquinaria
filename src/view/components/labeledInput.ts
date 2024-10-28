import Component from "./component.js";

/**
 * Opciones de configuración para el componente `LabeledInput`.
 */
export interface LabeledInputOptions {
  /** Identificador único del campo de entrada. */
  id?: string;
  /** Título que se mostrará como etiqueta del campo de entrada. */
  title: string;
  /** Tipo de entrada (por ejemplo, "text", "password", etc.). Por defecto es "text". */
  type?: string;
  /** Indica si el campo de entrada es obligatorio. */
  required?: boolean;
}

/**
 * Clase `LabeledInput` que representa un campo de entrada etiquetado con una etiqueta asociada.
 * Hereda de la clase base `Component`.
 */
export default class LabeledInput extends Component {
  /** Contenedor del campo de entrada y su etiqueta. */
  private readonly _container: HTMLElement;

  /** Elemento de etiqueta HTML asociado al campo de entrada. */
  public readonly label: HTMLLabelElement;

  /** Elemento de entrada HTML que representa el campo de entrada. */
  public readonly input: HTMLInputElement;

  /**
   * Crea una nueva instancia de `LabeledInput` con las opciones especificadas.
   * @param opts - Opciones de configuración que incluyen el id, el título, el tipo y si es requerido.
   */
  constructor(opts: LabeledInputOptions) {
    super();
    this._container = document.createElement("div");
    if (opts.id !== undefined) this._container.setAttribute("id", opts.id);

    this.label = document.createElement("label");
    this.input = document.createElement("input");

    this.text = opts.title; // Establece el texto de la etiqueta.
    this.type = opts.type ?? "text"; // Establece el tipo de entrada (por defecto es "text").
    this.required = opts.required ?? false; // Establece si el campo es requerido (por defecto es false).
  }

  /**
   * Renderiza el contenedor del campo de entrada y su etiqueta en el DOM.
   */
  render(): void {
    this._container.innerHTML = ""; // Limpia el contenedor antes de renderizar.
    this._container.appendChild(this.label); // Agrega la etiqueta al contenedor.
    this._container.appendChild(this.input); // Agrega el campo de entrada al contenedor.
  }

  /**
   * Obtiene el contenedor del campo de entrada.
   * @returns El elemento HTML que representa el contenedor del campo de entrada.
   */
  public get container(): HTMLElement {
    return this._container;
  }

  /**
   * Establece el texto de la etiqueta.
   * @param title - El nuevo título que se mostrará como etiqueta.
   */
  public set text(title: string) {
    const key = Component.normalizeKey(title); // Normaliza el título para el id.

    this.label.innerText = title.trim(); // Establece el texto de la etiqueta.

    // Asigna el atributo "for" a la etiqueta para mejorar la accesibilidad.
    this.label.setAttribute("for", `${key}-input`);
    this.input.setAttribute("id", `${key}-input`); // Asigna el id al campo de entrada.
  }

  /**
   * Establece el tipo de entrada del campo.
   * @param inputType - El tipo de entrada (ej. "text", "password", etc.).
   */
  public set type(inputType: string) {
    this.input.setAttribute("type", inputType);
  }

  /**
   * Obtiene el tipo de entrada del campo.
   * @returns El tipo de entrada actual del campo.
   */
  public get type(): string | null {
    return this.input.getAttribute("type");
  }

  /**
   * Obtiene el texto actual de la etiqueta.
   * @returns El texto actual de la etiqueta.
   */
  public get text(): string {
    return this.label.textContent ?? "";
  }

  /**
   * Establece si el campo de entrada es requerido.
   * @param b - Booleano que indica si el campo es requerido (`true`) o no (`false`).
   */
  public set required(b: boolean) {
    this.input.required = b; // Establece el atributo "required" en el campo de entrada.
  }
}
