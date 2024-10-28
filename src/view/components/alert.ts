import Component from "./component.js";

/**
 * `Alert` es un componente visual que muestra mensajes de alerta en estilo Bootstrap.
 * Utiliza clases de Bootstrap como `alert`, `alert-danger` y `d-none` para definir estilos y visibilidad.
 */
export default class Alert extends Component {
  /** Contenedor `<div>` del mensaje de alerta, oculto por defecto */
  private readonly alert: HTMLElement;

  /**
   * Crea una nueva instancia de `Alert`.
   * @param id - ID opcional para el elemento HTML de la alerta.
   */
  constructor(id: string | undefined = undefined) {
    super();
    this.alert = document.createElement("div") as HTMLElement;

    if (id !== undefined) this.alert.setAttribute("id", id);
    this.alert.classList.add("alert", "alert-danger", "d-none");
  }

  /**
   * Retorna el contenedor HTML de la alerta.
   * @returns Contenedor `<div>` de la alerta.
   */
  public get container(): HTMLElement {
    return this.alert;
  }

  public render(): void {}

  /**
   * Configura el mensaje mostrado en la alerta.
   * @param msg - Texto a mostrar en la alerta.
   */
  public set message(msg: string) {
    this.alert.innerText = msg;
  }

  /**
   * Retorna el mensaje actual de la alerta.
   * @returns Mensaje de texto dentro de la alerta.
   */
  public get message(): string {
    return this.alert.textContent ?? "";
  }

  /**
   * Define la visibilidad de la alerta.
   * @param opt - `true` para mostrar la alerta, `false` para ocultarla.
   */
  public set visible(opt: boolean) {
    if (opt) this.alert.classList.remove("d-none");
    else this.alert.classList.add("d-none");
  }
}
