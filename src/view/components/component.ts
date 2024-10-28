/**
 * Clase abstracta `Component`, base para construir componentes visuales.
 * Define métodos abstractos y utilidades comunes para clases derivadas.
 */
export default abstract class Component {
  /**
   * Renderiza el componente.
   * Método abstracto que las clases derivadas deben implementar para definir
   * cómo el componente debe renderizarse.
   */
  abstract render(): void;

  /**
   * Devuelve el contenedor HTML del componente.
   * Método abstracto que las clases derivadas deben implementar para obtener
   * el elemento HTML que representa el componente en el DOM.
   */
  abstract get container(): HTMLElement;

  /**
   * Normaliza una cadena de texto para ser utilizada como clave.
   * Convierte el texto a minúsculas, elimina los espacios y los reemplaza por guiones.
   * @param text - El texto a normalizar.
   * @returns La cadena de texto normalizada.
   */
  public static normalizeKey(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "-").trim();
  }
}
