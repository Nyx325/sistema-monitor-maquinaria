export default class Inputs {
  private inputs: { [key: string]: HTMLInputElement };

  constructor(inputs: { key: string; id: string }[] = []) {
    this.inputs = {};

    inputs.forEach((input) => {
      this.put(
        input.key,
        document.getElementById(input.id) as HTMLInputElement,
      );
    });
  }

  public put(key: string, input: HTMLInputElement) {
    this.inputs[key] = input;
  }

  public get(key: string): HTMLInputElement | undefined {
    return this.inputs[key];
  }

  public getValue(key: string): string | undefined {
    return this.inputs[key].value.trim();
  }

  public clearFields(): void {
    const keys = Object.keys(this.inputs);
    for (const key of keys) {
      this.inputs[key].value = "";
    }
  }
}
