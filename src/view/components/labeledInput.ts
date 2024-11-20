export default class LabeledInput {
  private container: HTMLElement;
  private label: HTMLLabelElement;
  public input: HTMLInputElement;

  constructor({
    containerId,
    labelId,
    inputId,
  }: {
    containerId: string;
    labelId: string;
    inputId: string;
  }) {
    this.container = document.getElementById(containerId) as HTMLElement;
    this.label = document.getElementById(labelId) as HTMLLabelElement;
    this.input = document.getElementById(inputId) as HTMLInputElement;
  }

  public setTitle(title: string) {
    this.label.innerText = title;
  }

  public getValue(): string {
    return this.input.value.trim();
  }

  public setValue(value: unknown) {
    this.input.value = String(value);
  }

  public clear() {
    this.input.value = "";
  }

  public setVisible(visible: boolean) {
    if (visible) this.container.classList.remove("d-none");
    else this.container.classList.add("d-none");
  }

  public disabled(disabled: boolean) {
    this.input.disabled = disabled;
  }

  public isChecked(): boolean {
    return this.input.checked;
  }

  public setChecked(checked: boolean) {
    this.input.checked = checked;
  }
}
