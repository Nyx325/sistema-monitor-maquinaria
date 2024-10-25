import Component from "./component.js";

export interface ButtonOptions {
  id?: string;
  text: string;
  type?: string;
  clases?: string[];
}

export default class Button extends Component {
  public button: HTMLButtonElement;

  constructor(opts: ButtonOptions) {
    super();
    this.button = document.createElement("button");
    if (opts.id !== undefined) this.button.setAttribute("id", opts.id);
    this.text = opts.text;
    this.type = opts.type ?? "button";
    this.addClasses(...(opts.clases ?? []));
  }

  render(): void {}

  public get container(): HTMLButtonElement {
    return this.button;
  }

  public set type(type: string) {
    this.button.setAttribute("type", type);
  }

  public get type(): string | null {
    return this.button.getAttribute("type");
  }

  public set text(text: string) {
    this.button.innerText = text;
  }

  public get text(): string | null {
    return this.button.textContent;
  }

  public addClasses(...tokens: string[]) {
    this.button.classList.add(...tokens);
  }

  public removeClasses(...tokens: string[]) {
    this.button.classList.remove(...tokens);
  }
}
