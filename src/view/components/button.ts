export default class Button {
  private _button: HTMLButtonElement;

  constructor(text: unknown = "") {
    this._button = document.createElement("button");
    this.button.innerText = `${text}`;
  }

  public setVisible(visible: boolean) {
    this.button.classList.toggle("d-none", !visible);
  }

  public setText(text: unknown) {
    this.button.innerText = String(text);
  }

  public onClick(fn: (event: MouseEvent) => void) {
    this.button.addEventListener("click", fn);
  }

  public setDisabled(disabled: boolean): void {
    this.button.classList.toggle("btn-danger", disabled);
    this.button.classList.toggle("btn-primary", !disabled);
    this.button.disabled = disabled;
  }

  public addClass(...tokens: string[]) {
    this.button.classList.add(...tokens);
  }
  public removeClass(...tokens: string[]) {
    this.button.classList.remove(...tokens);
  }

  public get button(): HTMLButtonElement {
    return this._button;
  }
}
