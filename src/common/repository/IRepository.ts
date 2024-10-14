import { Search } from "../model/Search";

/**
 * Interfaz para un repositorio genérico que maneja operaciones de almacenamiento y recuperación
 * de modelos.
 *
 * @template I - Tipo del identificador del modelo.
 * @template M - Tipo del modelo que extiende de la interfaz Model<I>.
 * @template NM - Tipo del modelo cuando se es un modelo nuevo donde
 * puede omitir elementos como el ID, la flag booleana, etc.
 */
export interface IRepository<M, NM> {
  /**
   * Agrega un nuevo modelo al repositorio.
   * @param model - El modelo a agregar.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la operación de adición se completa.
   */
  add(model: NM): Promise<void>;

  /**
   * Realiza una eliminación lógica del modelo, estableciendo su estado como inactivo.
   * @param model - El modelo a eliminar lógicamente.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la operación de eliminación lógica se completa.
   */
  logicalDeletion(model: M): Promise<void>;

  /**
   * Realiza una eliminación permanente del modelo.
   * @param model - El modelo a eliminar permanentemente.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la operación de eliminación permanente se completa.
   */
  permanentlyDeletion(model: M): Promise<void>;

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
  getByCriteria(criteria: Partial<M>, pageNumber: number): Promise<Search<M>>;
}
