import Component from "./component.js";

export interface HeaderOpts {
  title: string;
  href: string;
  iconPath: string;
}

export default class Header extends Component {
  private _container: HTMLElement;
  private _icon: HTMLImageElement;
  private title: { text: HTMLElement; href: HTMLElement };

  constructor(opts: HeaderOpts) {
    super();
    this._container = document.createElement("header");
    this._icon = document.createElement("img");
    this.title = {
      text: document.createElement("h1"),
      href: document.createElement("a"),
    };

    this._icon.setAttribute("src", opts.iconPath);
    this._icon.setAttribute("alt", "Logo MARSAL");

    this.title.text.innerHTML = opts.title;
    this.title.href.setAttribute("href", opts.href);
  }

  public set titleText(text: string) {
    this.title.text.innerHTML = text;
  }

  public set titleHref(href: string) {
    this.title.href.setAttribute("href", href);
  }

  public render() {
    this._container.innerHTML = "";
    this.title.href.innerHTML = "";
    this.title.href.appendChild(this.title.text);

    this._container.appendChild(this._icon);
    this._container.appendChild(this.title.href);
  }

  public get container() {
    return this._container;
  }

  public get icon() {
    return this._icon;
  }
}
