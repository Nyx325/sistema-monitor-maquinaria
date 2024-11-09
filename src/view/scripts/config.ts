/**
 * Clase de utilidades `Utils` que implementa el patrón Singleton y proporciona métodos
 * para manipulación de texto y construcción de URLs de API.
 */
export default class Utils {
  // Propiedad estática que contiene la única instancia de la clase Utils
  private static _instance: Utils;

  // Nombre del host de la página actual
  private hostname: string;

  // Puerto de la página actual
  private port: string;

  /**
   * Constructor privado para evitar instanciación directa y cumplir con el patrón Singleton.
   * Inicializa los valores de `hostname` y `port` a partir de la URL de la página actual.
   */
  private constructor() {
    this.hostname = document.location.hostname;
    this.port = document.location.port;
  }

  /**
   * Acceso a la instancia Singleton de `Utils`. Si la instancia aún no existe, se crea.
   * @returns La única instancia de `Utils`.
   */
  public static get instance(): Utils {
    if (!Utils._instance) Utils._instance = new Utils();
    return Utils._instance;
  }

  /**
   * Obtiene la URL base de la API construida a partir del `hostname` y `port`.
   * @returns La URL de la API en formato de cadena.
   */
  public get apiUrl(): string {
    return `http://${this.hostname}:${this.port}/api`;
  }

  /**
   * Convierte una cadena de texto en `snake_case` a `camelCase`.
   * @param snakeStr - La cadena en formato `snake_case` que se convertirá.
   * @returns La cadena en formato `camelCase`.
   */
  public snakeToCamel(snakeStr: string): string {
    return snakeStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Convierte una cadena de texto en `camelCase` a `snake_case`.
   * @param camelStr - La cadena en formato `camelCase` que se convertirá.
   * @returns La cadena en formato `snake_case`.
   */
  public camelToSnake(camelStr: string): string {
    return camelStr.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
  }

  /**
   * Crea una cadena de parámetros a partir de un objeto de criterios, donde las claves se
   * transforman a `camelCase`.
   * @param criteria - Un objeto que contiene los criterios como pares clave-valor.
   * @returns Una cadena que representa los parámetros de consulta en formato `key=value`.
   */
  public createParams(criteria: { [key: string]: unknown }): string {
    const keys = Object.keys(criteria);
    const params = [];

    for (const key of keys) {
      const param = `${this.snakeToCamel(key)}=${criteria[key]}`;
      params.push(param);
    }

    return params.join("&");
  }
}
