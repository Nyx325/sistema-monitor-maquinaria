export default abstract class Component {
  abstract render(): void;
  abstract get container(): HTMLElement;

  /**
   * Normaliza un nombre de campo para ser utilizado un texto.
   * Convierte el texto a minúsculas, elimina espacios y los reemplaza por guiones.
   * @param text - El nombre del campo a normalizar.
   * @returns El nombre normalizado.
   * @private
   */
  public static normalizeKey(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "-").trim();
  }
}
