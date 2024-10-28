export default class UserError extends Error {
  constructor(mensaje: string) {
    super(mensaje); // Llama al constructor de la clase Error
    this.name = "MiErrorPersonalizado"; // Establece un nombre específico para el error
  }
}
