import Utils from "../scripts/config.js";
/**
 * Interfaz genérica `IAdapter` que representa un adaptador para interactuar con una API.
 * Define los métodos básicos de CRUD (Crear, Leer, Actualizar y Eliminar), así como la consulta de datos con criterios específicos.
 *
 * @typeParam M - Tipo que representa el modelo completo que se usa en las operaciones de actualización, eliminación y consulta.
 * @typeParam NM - Tipo que representa el modelo de creación (nuevo modelo), usado en la operación de adición.
 * @typeParam I - Tipo que representa el identificador único de un modelo, usado en la operación de obtención.
 */
export class Adapter {
  protected endpoint: string;
  protected utils: Utils = Utils.instance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  /**
   * Agrega un nuevo modelo a la API.
   * @param model - Instancia del nuevo modelo (`NM`) que se añadirá.
   * @returns Una promesa que resuelve con la respuesta de la API.
   */
  async add(model: { [key: string]: unknown }): Promise<Response> {
    console.log("Model");
    console.log(model);
    return await fetch(`${this.utils.apiUrl}/${this.endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    });
  }

  /**
   * Elimina un modelo existente de la API.
   * @param model - Instancia del modelo (`M`) que se eliminará.
   * @returns Una promesa que resuelve con la respuesta de la API.
   */
  async delete(id: unknown): Promise<Response> {
    return await fetch(`${this.utils.apiUrl}/${this.endpoint}/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * Actualiza un modelo existente en la API.
   * @param model - Instancia del modelo (`M`) con los datos actualizados.
   * @returns Una promesa que resuelve con la respuesta de la API.
   */
  async update(model: { [key: string]: unknown }): Promise<Response> {
    return await fetch(`${this.utils.apiUrl}/${this.endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    });
  }

  /**
   * Obtiene una lista de modelos que cumplen con ciertos criterios de búsqueda, con soporte de paginación.
   * @param criteria - Objeto parcial (`Partial<M>`) que contiene los criterios de búsqueda para filtrar los modelos.
   * @param pageNumber - Número de página para la paginación de los resultados.
   * @returns Una promesa que resuelve con la respuesta de la API.
   */
  async getBy(
    criteria: { [key: string]: unknown },
    pageNumber: number,
  ): Promise<Response> {
    console.log(`Criteria:`);
    console.log(criteria);
    const params = this.utils.createParams(criteria);
    console.log(`Params: ${params}`);
    return await fetch(
      `${this.utils.apiUrl}/${this.endpoint}?pageNumber=${pageNumber}&${params}`,
    );
  }

  /**
   * Obtiene un modelo específico por su identificador.
   * @param id - Identificador único (`I`) del modelo que se desea obtener.
   * @returns Una promesa que resuelve con la respuesta de la API.
   */
  async get(id: unknown): Promise<Response> {
    return await fetch(`${this.utils.apiUrl}/${this.endpoint}/${id}`);
  }
}
