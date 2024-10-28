import Component from "./component.js";

/**
 * Opciones para configurar un botón.
 */
export interface ButtonOptions {
  /** ID opcional para el elemento del botón. */
  id?: string;
  /** Texto a mostrar en el botón. */
  text: string;
  /** Tipo del botón, por defecto es `"button"`. */
  type?: string;
  /** Clases de CSS para agregar al boton. */
  clases?: string[];
}

/**
 * Clase `Button` que representa un botón HTML con opciones de configuración y control de clases.
 * Hereda de `Component`.
 */
export default class Button extends Component {
  /** Elemento HTML del botón. */
  public button: HTMLButtonElement;

  /**
   * Crea una nueva instancia de `Button` con las opciones especificadas.
   * @param opts - Opciones de configuración del botón, incluyendo id, texto, tipo y clases.
   */
  constructor(opts: ButtonOptions) {
    super();
    this.button = document.createElement("button");
    if (opts.id !== undefined) this.button.setAttribute("id", opts.id);
    this.text = opts.text;
    this.type = opts.type ?? "button";
    this.addClasses(...(opts.clases ?? []));
  }

  /**
   * Renderiza el botón en el DOM. Método obligatorio para cumplir con la clase base `Component`.
   */
  render(): void {}

  /**
   * Devuelve el contenedor HTML del botón.
   * @returns El elemento `HTMLButtonElement` del botón.
   */
  public get container(): HTMLButtonElement {
    return this.button;
  }

  /**
   * Establece o devuelve el tipo del botón (`"button"`, `"submit"`, etc.).
   */
  public set type(type: string) {
    this.button.setAttribute("type", type);
  }

  public get type(): string | null {
    return this.button.getAttribute("type");
  }

  /**
   * Establece o devuelve el texto del botón.
   */
  public set text(text: string) {
    this.button.innerText = text;
  }

  public get text(): string | null {
    return this.button.textContent;
  }

  /**
   * Añade clases CSS al botón.
   * @param tokens - Lista de clases CSS a agregar.
   */
  public addClasses(...tokens: string[]) {
    this.button.classList.add(...tokens);
  }

  /**
   * Remueve clases CSS del botón.
   * @param tokens - Lista de clases CSS a remover.
   */
  public removeClasses(...tokens: string[]) {
    this.button.classList.remove(...tokens);
  }
}
