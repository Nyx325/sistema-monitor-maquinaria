import Component from "./component.js";

export interface ModalOptions<C extends Component> {
  id?: string;
  content: C;
}

export default class Modal<C extends Component> extends Component {
  private modal: HTMLElement;
  public content: C;

  constructor(opts: ModalOptions<C>) {
    super();
    this.modal = document.createElement("dialog");
    if (opts.id !== undefined) this.modal.setAttribute("id", opts.id);

    this.content = opts.content;
    this.show(false);
  }

  public render(): void {
    this.modal.innerHTML = "";
    this.content.render();
    this.modal.appendChild(this.content.container);
  }

  public get container(): HTMLElement {
    return this.modal;
  }

  public show(opt: boolean) {
    if (opt) {
      this.modal.style.display = "block";
    } else {
      this.modal.style.display = "none";
    }
  }
}
