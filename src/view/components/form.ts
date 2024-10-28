import Alert from "./alert.js";
import Button, { ButtonOptions } from "./button.js";
import Component from "./component.js";
import LabeledInput, { LabeledInputOptions } from "./labeledInput.js";

export interface FormOpts {
  id?: string;
  title: string;
}

/**
 * La clase `Form` representa un formulario que contiene un grupo de campos de entrada etiquetados.
 * Se puede configurar a partir de un array de strings o de objetos con configuraciones específicas.
 */
export class Form extends Component {
  /** Instancia de la clase `Alert` asociada al formulario para manejar alertas. */
  public readonly alert: Alert;

  /** Contenedor del formulario, implementado como un elemento HTML `<form>`. */
  public readonly container: HTMLFormElement;

  /** Elemento HTML `<legend>` que muestra el título del formulario. */
  private readonly legend: HTMLLegendElement;

  /** Objeto que almacena las entradas etiquetadas, indexadas por una clave generada a partir de los títulos. */
  private _fields: { [key: string]: LabeledInput } = {};
  private _buttons: { [key: string]: Button } = {};

  /**
   * Crea una instancia de la clase `Form` con un título especificado.
   * @param title - El título que se mostrará en el formulario.
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
   * Las claves son los nombres normalizados de cada campo.
   * @returns Un objeto donde cada clave es el nombre normalizado del campo y el valor es la instancia `LabeledInput`.
   */
  public get fields(): { [key: string]: LabeledInput } {
    return this._fields;
  }

  /**
   * Configura el título del formulario, que se muestra en el elemento `<legend>`.
   * @param title - El título a mostrar.
   */
  public set title(title: string) {
    this.legend.innerText = title.trim();
  }

  /**
   * Inicializa los campos del formulario en base a un array de objetos.
   * Limpia el contenedor, reinicia `_fields`, y agrega cada campo especificado.
   * @param fields - Array de objetos que representan cada campo con propiedades `title` y `type`.
   * @private
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
   * @param fieldName - Nombre del campo a buscar (se normaliza para evitar discrepancias de formato).
   * @returns La instancia `LabeledInput` correspondiente al campo, o `undefined` si no existe.
   */
  public getField(key: string): LabeledInput | undefined {
    return this._fields[key];
  }

  public setButtons(buttons: ButtonOptions[]) {
    this._buttons = {};

    buttons.forEach((opts) => {
      const button = new Button(opts);
      const key = opts.id ?? Component.normalizeKey(opts.text);
      this._buttons[key] = button;
    });
  }

  public getButton(key: string): Button | undefined {
    return this._buttons[key];
  }

  public cleanFields(): void {
    const keys = Object.keys(this._fields);
    keys.forEach((key) => {
      this._fields[key].input.value = "";
    });
  }
}
