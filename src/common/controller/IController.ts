import { Search } from "../model/Search";
import { IRepository } from "../repository/IRepository";

export abstract class IController<M, NM> {
  readonly repository: IRepository<M, NM>;

  constructor(repository: IRepository<M, NM>) {
    this.repository = repository;
  }

  /**
   * Valida si la entidad es válida de acuerdo a nuestra
   * lógica de negocio
   * @param model - El modelo a agregar.
   * @throws {Error} - lanza un error si el modelo no
   * es válido.
   */
  abstract isModelValid(model: M): void;

  /**
   * Valida si la entidad es válida de acuerdo a nuestra
   * lógica de negocio
   * @param model - El modelo a agregar.
   * @throws {Error} - lanza un error si el modelo no
   * es válido.
   */
  abstract isNewModelValid(model: NM): void;

  /**
   * Agrega un nuevo modelo al repositorio.
   * @param model - El modelo a agregar.
   * @throws {Error} - lanza un error si el modelo no
   * es válido.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la operación de adición se completa.
   */
  async add(model: NM): Promise<void> {
    this.isNewModelValid(model);
    await this.repository.add(model);
  }

  /**
   * Realiza una eliminación permanente del modelo.
   * @param model - El modelo a eliminar permanentemente.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la operación de eliminación permanente se completa.
   */
  async permanentlyDeletion(model: M): Promise<void> {
    await this.repository.permanentlyDeletion(model);
  }

  /**
   * Actualiza un modelo existente en el repositorio.
   * @param model - El modelo con los datos actualizados.
   * @throws {Error} - lanza un error si el modelo no
   * es válido.
   * @returns {Promise<void>} - Promesa que se resuelve cuando la operación de actualización se completa.
   */
  async update(model: M): Promise<void> {
    this.isModelValid(model);
    await this.repository.update(model);
  }

  /**
   * Recupera modelos basados en criterios de búsqueda y paginación.
   * @param criteria - Un objeto que contiene los criterios de búsqueda.
   * @param pageNumber - El número de página para la paginación.
   * @returns {Promise<Search<M>>} - Promesa que se resuelve con los resultados de búsqueda.
   */
  async getByCriteria(
    criteria: Partial<M>,
    pageNumber: number,
  ): Promise<Search<M>> {
    return await this.repository.getBy(criteria, pageNumber);
  }
}
