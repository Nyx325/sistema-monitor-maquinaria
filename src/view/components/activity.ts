export default class Activity {
  private container: HTMLElement;
  private trueI: HTMLInputElement;
  private falseI: HTMLInputElement;

  constructor(opts: {
    container: HTMLElement;
    trueI: HTMLInputElement;
    falseI: HTMLInputElement;
  }) {
    this.container = opts.container;
    this.trueI = opts.trueI;
    this.falseI = opts.falseI;
  }

  public getSelection(): boolean | undefined {
    if (this.trueI.checked) return true;
    if (this.falseI.checked) return false;
    return undefined;
  }

  public setSelection(value: boolean): void {
    this.trueI.checked = value;
    this.falseI.checked = !value;
    return undefined;
  }

  public setVisible(opt: boolean): void {
    if (opt) this.container.classList.remove("d-none");
    else this.container.classList.add("d-none");
  }
}
