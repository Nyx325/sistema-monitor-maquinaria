import Header from "./header.js";

/**
 * Clase `GeneralHeader` que representa un encabezado específico para la aplicación.
 * Hereda de la clase `Header` y personaliza su contenido y estilo.
 */
export default class GeneralHeader extends Header {
  /**
   * Crea una nueva instancia de `GeneralHeader`.
   * Inicializa el encabezado con un título, enlace e icono predeterminados.
   * Además, aplica clases CSS al contenedor y al icono, y carga el archivo de estilos.
   */
  constructor() {
    super({
      title: "Hello world", // Título que se mostrará en el encabezado.
      href: "/", // URL del enlace que se dirigirá al inicio.
      iconPath: "/assets/icons/LogoMarsal.png", // Ruta del icono a mostrar.
    });

    // Agrega clases CSS para aplicar estilos personalizados.
    this.container.classList.add("header-container");
    this.icon.classList.add("logo");

    // Crea y configura un elemento de enlace para el archivo de estilos.
    const link = document.createElement("link");
    link.rel = "stylesheet"; // Especifica que se trata de un enlace a una hoja de estilo.
    link.href = "css/header.css"; // Ruta al archivo CSS del encabezado.

    // Agrega el elemento de enlace al <head> del documento.
    document.head.appendChild(link);
  }
}
