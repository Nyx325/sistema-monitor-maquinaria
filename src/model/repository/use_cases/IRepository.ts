import { Search } from "../../entities/Search.js";

/**
 * Interfaz para un repositorio genérico que maneja operaciones de almacenamiento y recuperación
 * de modelos.
 *
 * @template I - Tipo del identificador del modelo.
 * @template M - Tipo del modelo que extiende de la interfaz Model<I>.
 * puede omitir elementos como el ID, la flag booleana, etc.
 */
export interface IRepository<M> {
  /**
   * Agrega un nuevo modelo al repositorio.
   * @param model - El modelo a agregar.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la operación de adición se completa.
   */
  add(model: M): Promise<void>;

  /**
   * Realiza una eliminación logica del modelo.
   * @param model - El modelo a eliminar permanentemente.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la operación de eliminación permanente se completa.
   */
  delete(model: M): Promise<void>;

  /**
   * Actualiza un modelo existente en el repositorio.
   * @param model - El modelo con los datos actualizados.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la operación de actualización se completa.
   */
  update(model: M): Promise<void>;

  /**
   * Recupera modelos basados en criterios de búsqueda y paginación.
   * @param criteria - Un objeto que contiene los criterios de búsqueda.
   * @param pageNumber - El número de página para la paginación.
   * @returns {Promise<Search<M>>} - Promesa que se resuelve con los resultados de búsqueda.
   */
  getBy(criteria: Partial<M>, pageNumber: number): Promise<Search<M>>;
}
