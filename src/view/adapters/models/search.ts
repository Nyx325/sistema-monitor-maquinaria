/**
 * Una interfaz genérica que representa los resultados de una búsqueda, incluyendo información sobre
 * la paginación, los criterios de búsqueda utilizados y el conjunto de resultados obtenidos.
 *
 * @template M - El tipo de modelo que se está buscando. Esta interfaz permite manejar diferentes
 * tipos de modelos en función de los criterios de búsqueda.
 */
export interface Search {
  /**
   * El número total de páginas disponibles en los resultados de la búsqueda.
   *
   * Este campo permite conocer cuántas páginas de resultados hay en total, lo que es útil para
   * la navegación a través de los resultados paginados.
   */
  totalPages: number;

  /**
   * El número de la página actual en la que se encuentran los resultados.
   *
   * Este campo indica la página específica que se está visualizando en este momento, lo que permite
   * a los usuarios entender su posición dentro del conjunto total de resultados.
   */
  currentPage: number;

  /**
   * Los criterios de búsqueda utilizados para filtrar los resultados.
   *
   * Este campo es un objeto parcial que puede contener uno o más campos del tipo `M`. Permite
   * almacenar los parámetros que se usaron para realizar la búsqueda, facilitando la reproducción
   * de la misma o la visualización de los filtros aplicados.
   */
  criteria: Partial<{ [key: string]: unknown }>;

  /**
   * El conjunto de resultados obtenidos de la búsqueda.
   *
   * Este campo puede ser un arreglo de instancias del tipo `M` que representan los elementos
   * encontrados o `undefined` si no se encontraron resultados. Permite a los usuarios ver
   * los resultados de la búsqueda efectuada.
   */
  result: { [key: string]: unknown }[];
}
