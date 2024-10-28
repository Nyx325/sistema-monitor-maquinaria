import Alert from "./alert.js";
import Button, { ButtonOptions } from "./button.js";
import Component from "./component.js";
import LabeledInput, { LabeledInputOptions } from "./labeledInput.js";

/**
 * Opciones de configuración para el formulario.
 */
export interface FormOpts {
  /** ID opcional para el formulario. */
  id?: string;
  /** Título que se muestra en el formulario. */
  title: string;
}

/**
 * Clase `Form` que representa un formulario con campos de entrada etiquetados y botones.
 * Incluye un componente de alerta (`Alert`) y permite configurar tanto los campos como los botones.
 */
export class Form extends Component {
  /** Componente `Alert` asociado al formulario, usado para mostrar mensajes de alerta. */
  public readonly alert: Alert;

  /** Contenedor del formulario representado como un elemento HTML `<form>`. */
  public readonly container: HTMLFormElement;

  /** Elemento HTML `<legend>` que muestra el título del formulario. */
  private readonly legend: HTMLLegendElement;

  /** Campos de entrada del formulario, indexados por una clave generada a partir de los títulos. */
  private _fields: { [key: string]: LabeledInput } = {};

  /** Botones del formulario, indexados por una clave generada a partir de los textos de los botones. */
  private _buttons: { [key: string]: Button } = {};

  /**
   * Crea una nueva instancia de `Form` con las opciones especificadas.
   * @param opts - Opciones de configuración para el formulario, como el título y un id opcional.
   */
  constructor(opts: FormOpts) {
    super();
    this.container = document.createElement("form");
    if (opts.id !== undefined) this.container.setAttribute("id", opts.id);

    this.alert = new Alert();
    this.legend = document.createElement("legend");

    this.container.appendChild(this.legend);
    this.title = opts.title;
  }

  /**
   * Renderiza el formulario junto con sus campos, botones y el componente de alerta.
   */
  public render() {
    let keys = [];
    this.container.innerHTML = "";

    this.container.appendChild(this.legend);

    this.alert.render();
    this.container.appendChild(this.alert.container);

    keys = Object.keys(this._fields);
    keys.forEach((key) => {
      const field = this._fields[key];
      field.render();
      this.container.appendChild(field.container);
    });

    keys = Object.keys(this._buttons);
    keys.forEach((key) => {
      const button = this._buttons[key];
      button.render();
      this.container.appendChild(button.container);
    });
  }

  /**
   * Obtiene los campos actuales del formulario como un objeto indexado.
   * @returns Objeto donde cada clave es el nombre normalizado del campo y el valor es una instancia de `LabeledInput`.
   */
  public get fields(): { [key: string]: LabeledInput } {
    return this._fields;
  }

  /**
   * Configura el título del formulario, que se muestra en el elemento `<legend>`.
   * @param title - Texto que se mostrará como título del formulario.
   */
  public set title(title: string) {
    this.legend.innerText = title.trim();
  }

  /**
   * Inicializa los inputs del formulario con un arreglo de configuraciones.
   * Limpia el contenedor y redefine todos los inputs en base a las configuraciones de los nuevos campos.
   * @param fields - Arreglo de configuraciones para cada campo, que incluye propiedades como `title` y `type`.
   */
  public setFields(fields: LabeledInputOptions[]): void {
    this._fields = {};

    fields.forEach((field) => {
      const labeledInput = new LabeledInput(field);
      const key = field.id ?? Component.normalizeKey(field.title);
      this._fields[key] = labeledInput;
    });
  }

  /**
   * Obtiene un campo específico del formulario.
   * @param key - Nombre normalizado del campo a buscar.
   * @returns Instancia `LabeledInput` del campo o `undefined` si no existe.
   */
  public getField(key: string): LabeledInput | undefined {
    return this._fields[key];
  }

  /**
   * Configura los botones del formulario en base a un arreglo de opciones.
   * @param buttons - Arreglo de configuraciones para cada botón, que incluye propiedades como `text` e `id`.
   */
  public setButtons(buttons: ButtonOptions[]) {
    this._buttons = {};

    buttons.forEach((opts) => {
      const button = new Button(opts);
      const key = opts.id ?? Component.normalizeKey(opts.text);
      this._buttons[key] = button;
    });
  }

  /**
   * Obtiene un botón específico del formulario.
   * @param key - Nombre normalizado del botón a buscar.
   * @returns Instancia `Button` correspondiente o `undefined` si no existe.
   */
  public getButton(key: string): Button | undefined {
    return this._buttons[key];
  }

  /**
   * Limpia los valores de todos los campos de entrada en el formulario.
   */
  public cleanFields(): void {
    const keys = Object.keys(this._fields);
    keys.forEach((key) => {
      this._fields[key].input.value = "";
    });
  }
}
