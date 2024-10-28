import Header from "./header.js";

export default class GeneralHeader extends Header {
  constructor() {
    super({
      title: "Hello world",
      href: "/",
      iconPath: "/assets/icons/LogoMarsal.png",
    });

    this.container.classList.add("header-container");
    this.icon.classList.add("logo");

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = "css/header.css";

    document.head.appendChild(link);
  }
}
