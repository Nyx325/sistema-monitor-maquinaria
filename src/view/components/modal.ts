import Component from "./component.js";

/**
 * Opciones de configuración para el componente `Modal`.
 *
 * @template C - Tipo de componente que se mostrará en el modal.
 */
export interface ModalOptions<C extends Component> {
  /** Identificador único del modal (opcional). */
  id?: string;
  /** Componente que se mostrará como contenido del modal. */
  content: C;
}

/**
 * Clase `Modal` que representa un cuadro de diálogo que puede mostrar contenido dinámico.
 * Hereda de la clase base `Component`.
 *
 * @template C - Tipo de componente que se mostrará en el modal.
 */
export default class Modal<C extends Component> extends Component {
  /** Elemento HTML que representa el modal. */
  private modal: HTMLElement;

  /** Componente que se muestra como contenido del modal. */
  public content: C;

  /** Variable para almacenar temporalment el dato a modificar */
  public element: { [key: string]: unknown } | undefined;

  /**
   * Crea una nueva instancia de `Modal` con las opciones especificadas.
   *
   * @param opts - Opciones de configuración que incluyen el id y el contenido del modal.
   */
  constructor(opts: ModalOptions<C>) {
    super();
    this.modal = document.createElement("dialog");
    if (opts.id !== undefined) this.modal.setAttribute("id", opts.id);

    this.content = opts.content; // Establece el contenido del modal.
    this.show(false); // Inicialmente oculta el modal.
  }

  /**
   * Renderiza el contenido del modal en el DOM.
   * Limpia el contenido existente y agrega el nuevo contenido renderizado.
   */
  public render(): void {
    this.modal.innerHTML = ""; // Limpia el contenido del modal.
    this.content.render(); // Renderiza el contenido del componente.
    this.modal.appendChild(this.content.container); // Agrega el contenido al modal.
  }

  /**
   * Obtiene el contenedor del modal.
   *
   * @returns El elemento HTML que representa el modal.
   */
  public get container(): HTMLElement {
    return this.modal;
  }

  /**
   * Muestra u oculta el modal según la opción proporcionada.
   *
   * @param opt - Booleano que indica si el modal debe ser visible (`true`) u oculto (`false`).
   */
  public show(opt: boolean) {
    if (opt) {
      this.modal.style.display = "block"; // Muestra el modal.
    } else {
      this.modal.style.display = "none"; // Oculta el modal.
    }
  }
}
