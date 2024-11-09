/**
 * Clase `Modal` que representa un cuadro de diálogo que puede mostrar contenido dinámico.
 * Hereda de la clase base `Component`.
 *
 * @template C - Tipo de componente que se mostrará en el modal.
 */
export default class Modal {
  /** Elemento HTML que representa el modal. */
  private modal: HTMLElement;

  constructor(id: string) {
    this.modal = document.getElementById(id) as HTMLDialogElement;
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
