import Component from "./component.js";

export interface LabeledInputOptions {
  id?: string;
  title: string;
  type?: string;
  required?: boolean;
}

export default class LabeledInput extends Component {
  private readonly _container: HTMLElement;
  public readonly label: HTMLLabelElement;
  public readonly input: HTMLInputElement;

  constructor(opts: LabeledInputOptions) {
    super();
    this._container = document.createElement("div");
    if (opts.id !== undefined) this._container.setAttribute("id", opts.id);

    this.label = document.createElement("label");
    this.input = document.createElement("input");

    this.text = opts.title;
    this.type = opts.type ?? "text";
    this.required = opts.required ?? false;
  }

  render(): void {
    this._container.innerHTML = "";
    this._container.appendChild(this.label);
    this._container.appendChild(this.input);
  }

  public get container(): HTMLElement {
    return this._container;
  }

  public set text(title: string) {
    const key = Component.normalizeKey(title);

    this.label.innerText = title.trim();

    // Eliminamos las asignaciones de id
    this.label.setAttribute("for", `${key}-input`); // Se mantiene para la accesibilidad
    this.input.setAttribute("id", `${key}-input`);
  }

  public set type(inputType: string) {
    this.input.setAttribute("type", inputType);
  }

  public get type(): string | null {
    return this.input.getAttribute("type");
  }

  public get text(): string {
    return this.label.textContent ?? "";
  }

  public set required(b: boolean) {
    this.input.required = b;
  }
}
