import Utils from "./config.js";

class ReportAdapter {
  protected endpoint: string;
  protected utils: Utils;
  protected url: string;

  constructor() {
    this.utils = Utils.instance; // Permite inyectar dependencias para pruebas.
    this.endpoint = "reportes";
    this.url = `${this.utils.apiUrl}/${this.endpoint}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ReportAdapter();
});
