/**
 * Una interfaz genérica que define la estructura para gestionar una conexión a una base de datos
 * u otro servicio. Esta interfaz proporciona métodos para obtener y liberar conexiones, así como
 * inicializar la base de datos y verificar su existencia.
 *
 * @template Conn - El tipo del objeto de conexión que este conector maneja. Este puede ser un cliente
 * de base de datos, un servicio de API, o cualquier otro objeto de conexión.
 */
export interface IConnector<Conn> {
  /**
   * Obtiene el objeto de conexión.
   *
   * Este método es responsable de proporcionar una instancia del objeto de conexión, que puede ser
   * utilizado para interactuar con la base de datos o servicio asociado. Puede devolver una conexión
   * existente o crear una nueva si es necesario.
   *
   * @returns {Promise<Conn>} Una promesa que resuelve en el objeto de conexión de tipo `Conn`.
   */
  getConnection(): Promise<Conn>;

  /**
   * Libera una conexión previamente obtenida.
   *
   * Este método permite devolver una conexión al pool de conexiones o a la gestión interna del
   * conector. Debe ser llamado después de que la conexión ha sido utilizada para asegurar que
   * pueda ser reutilizada en el futuro.
   *
   * @param {Conn} conn - El objeto de conexión de tipo `Conn` que se va a liberar.
   */
  releaseConnection(conn: Conn): void;

  /**
   * Cierra la conexión o libera los recursos utilizados por el conector.
   *
   * Este método se encarga de cerrar todas las conexiones activas y liberar los recursos
   * asociados con el conector. Es importante llamar a este método cuando ya no se necesite
   * interactuar con la base de datos o servicio para evitar pérdidas de memoria o conexiones
   * abiertas innecesariamente.
   *
   * @returns {Promise<void>} Una promesa que se resuelve cuando la desconexión ha sido completada.
   */
  disconnect(): Promise<void>;
}
