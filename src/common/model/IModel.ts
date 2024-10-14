/**
 * Una interfaz genérica que representa un modelo básico con un identificador y un estado de actividad.
 * Esta interfaz puede ser utilizada como base para definir diferentes tipos de modelos en una aplicación.
 *
 * @template IdType - El tipo del identificador que se utilizará para identificar de manera única
 * a las instancias del modelo. Puede ser un número, una cadena u otro tipo que represente un ID.
 */
export interface IModel<IdType> {
  /**
   * El identificador único de la instancia del modelo.
   *
   * Este campo es de solo lectura, lo que significa que no se puede modificar una vez que
   * se ha establecido. Es crucial para identificar de manera única la instancia dentro
   * de una colección o sistema.
   */
  readonly id: IdType;

  /**
   * Indica si la instancia del modelo está activa.
   *
   * Este campo puede ser utilizado para determinar si el modelo está en uso o si ha sido
   * desactivado. Un valor de `true` indica que el modelo está activo, mientras que `false`
   * indica que está inactivo.
   */
  active: boolean;
}
