import Component from "./component.js";

/**
 * Opciones de configuración para el componente `Header`.
 */
export interface HeaderOpts {
  /** Título que se mostrará en el encabezado. */
  title: string;
  /** URL a la que se dirigirá el enlace del encabezado. */
  href: string;
  /** Ruta del icono que se mostrará en el encabezado. */
  iconPath: string;
}

/**
 * Clase `Header` que representa un encabezado HTML con un icono y un título que actúa como enlace.
 * Hereda de la clase base `Component`.
 */
export default class Header extends Component {
  /** Contenedor principal del encabezado. */
  protected _container: HTMLElement;

  /** Elemento de imagen que representa el icono en el encabezado. */
  protected _icon: HTMLImageElement;

  /** Objeto que contiene el título y el enlace del encabezado. */
  protected title: { text: HTMLElement; href: HTMLElement };

  /**
   * Crea una nueva instancia de `Header` con las opciones especificadas.
   * @param opts - Opciones de configuración que incluyen el título, la URL del enlace y la ruta del icono.
   */
  constructor(opts: HeaderOpts) {
    super();
    this._container = document.createElement("header");
    this._icon = document.createElement("img");
    this.title = {
      text: document.createElement("h1"),
      href: document.createElement("a"),
    };

    this._icon.setAttribute("src", opts.iconPath);
    this._icon.setAttribute("alt", "Logo MARSAL");

    this.title.text.innerHTML = opts.title;
    this.title.href.setAttribute("href", opts.href);
  }

  /**
   * Establece el texto del título en el encabezado.
   * @param text - Nuevo texto que se mostrará como título.
   */
  public set titleText(text: string) {
    this.title.text.innerHTML = text;
  }

  /**
   * Establece la URL del enlace del título.
   * @param href - Nueva URL a la que se dirigirá el enlace.
   */
  public set titleHref(href: string) {
    this.title.href.setAttribute("href", href);
  }

  /**
   * Renderiza el contenido del encabezado en el DOM, incluyendo el icono y el título como enlace.
   */
  public render() {
    this._container.innerHTML = "";
    this.title.href.innerHTML = "";
    this.title.href.appendChild(this.title.text);

    this._container.appendChild(this._icon);
    this._container.appendChild(this.title.href);
  }

  /**
   * Obtiene el contenedor del encabezado.
   * @returns El elemento HTML que representa el contenedor del encabezado.
   */
  public get container() {
    return this._container;
  }

  /**
   * Obtiene el elemento de icono del encabezado.
   * @returns El elemento de imagen que representa el icono.
   */
  public get icon() {
    return this._icon;
  }
}
