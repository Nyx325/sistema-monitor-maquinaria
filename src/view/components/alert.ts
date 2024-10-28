import Component from "./component.js";

/**
 * La clase `Alert` representa un componente de alerta visual que sigue el estilo de Bootstrap.
 * Utiliza clases de Bootstrap para el estilo (`alert`, `alert-danger`) y para la visibilidad (`d-none`).
 */
export default class Alert extends Component {
  /** Elemento HTML `<div>` que contiene el mensaje de alerta, estilizado con clases de Bootstrap. */
  private readonly alert: HTMLElement;

  /**
   * Crea una instancia de `Alert`.
   * Inicializa el contenedor de alerta como un elemento `<div>` con clases de Bootstrap:
   * - `alert`: aplica el estilo general de alertas.
   * - `alert-danger`: establece el estilo para una alerta de tipo "peligro" (rojo).
   * - `d-none`: oculta el elemento por defecto.
   */
  constructor(id: string | undefined = undefined) {
    super();
    this.alert = document.createElement("div") as HTMLElement;

    if (id !== undefined) this.alert.setAttribute("id", id);
    this.alert.classList.add("alert", "alert-danger", "d-none");
  }

  /**
   * Obtiene el elemento contenedor de la alerta.
   * @returns El contenedor HTML de la alerta.
   */
  public get container(): HTMLElement {
    return this.alert;
  }

  public render(): void {}

  /**
   * Configura el mensaje de texto que se mostrará en la alerta.
   * @param msg - El mensaje a mostrar en el contenido de la alerta.
   */
  public set message(msg: string) {
    this.alert.innerText = msg;
  }

  /**
   * Obtiene el mensaje de texto actual de la alerta.
   * @returns El mensaje actual dentro de la alerta.
   */
  public get message(): string {
    return this.alert.textContent ?? "";
  }

  /**
   * Controla la visibilidad de la alerta.
   * - Si `true`, remueve la clase `d-none` para mostrar la alerta.
   * - Si `false`, agrega la clase `d-none` para ocultarla.
   * @param opt - Booleano que indica si la alerta debe estar visible (`true`) u oculta (`false`).
   */
  public set visible(opt: boolean) {
    if (opt) this.alert.classList.remove("d-none");
    else this.alert.classList.add("d-none");
  }
}
