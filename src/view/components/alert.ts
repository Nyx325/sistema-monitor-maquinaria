export default class Alert {
  private readonly alert: HTMLElement;

  constructor(id: string) {
    this.alert = document.getElementById(id) as HTMLElement;
  }

  public get container(): HTMLElement {
    return this.alert;
  }

  public setMessage(msg: string) {
    this.alert.innerText = msg;
  }

  public setVisible(opt: boolean) {
    if (opt) this.alert.classList.remove("d-none");
    else this.alert.classList.add("d-none");
  }
}
