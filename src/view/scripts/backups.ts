import Alert from "../components/alert.js";
import Modal from "../components/modal.js";
import Pager from "../components/pager.js";
import { Table } from "../components/table.js";
import TableView from "../components/tableView.js";

type BackupSearch = {
  page: number;
  totalPages: number;
  backups: string[];
};

type Backup = {
  name: string;
};

class BackupsView implements TableView {
  protected url: string;
  protected modal: Modal;
  protected modalLegend: HTMLLegendElement;
  protected yesBtn: HTMLButtonElement;
  protected noBtn: HTMLButtonElement;

  protected alert: Alert;
  protected table: Table<Backup>;
  protected pager: Pager<Backup>;

  protected newBtn: HTMLButtonElement;
  protected restoreBtn: HTMLButtonElement;

  constructor() {
    this.url = `http://${document.location.host}/api/backups`;

    this.modal = new Modal("modal");
    this.modalLegend = document.getElementById(
      "modal-legend",
    ) as HTMLLegendElement;

    this.yesBtn = document.getElementById("yes-btn") as HTMLButtonElement;
    this.noBtn = document.getElementById("yes-btn") as HTMLButtonElement;

    this.newBtn = document.getElementById("new") as HTMLButtonElement;
    this.restoreBtn = document.getElementById("restore") as HTMLButtonElement;

    this.alert = new Alert("alert");

    this.table = new Table("table");
    this.pager = new Pager({
      table: this.table,
      view: this,
      maxBtns: 5,
      container: "pager",
    });

    this.init();
  }

  private init() {
    this.initTable();
    this.initButton();
    this.initModal();
  }

  private initTable() {
    this.table.setHeaders(["Respaldos"]);
    this.table.onParseData((r) => {
      return [r.name];
    });

    this.refreshTable().then();
  }

  private initButton() {
    this.newBtn.addEventListener("click", async () => {
      const response = await fetch(this.url, {
        method: "POST",
      });

      if (response.status >= 400) {
        const err = await response.json();
        this.alert.setMessage(err.message);
        this.alert.setVisible(true);
      }

      this.alert.setVisible(false);
      this.refreshTable();
    });

    this.restoreBtn.addEventListener("click", () => {
      if (this.table.lastSelected === undefined) return;

      const r = this.table.lastSelected.record;
      this.modalLegend.innerText = `¿Seguro que quiere restaurar ${r.name}?`;
      this.modal.show(true);
    });
  }

  private initModal() {
    this.yesBtn.addEventListener("click", async () => {
      this.modal.show(false);

      if (this.table.lastSelected === undefined) {
        const msg = "No se seleccionó ningun registro";
        console.error(msg);
        this.alert.setMessage(msg);
        this.alert.setVisible(true);
        return;
      }

      const r = this.table.lastSelected.record;
      const response = await fetch(this.url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backup_name: r.name,
        }),
      });

      if (response.status >= 400) {
        const err = await response.json();
        console.error(err.message);
        this.alert.container.classList.remove("alert-success");
        this.alert.container.classList.add("alert-danger");
        this.alert.setMessage(err.message);
        this.alert.setVisible(true);
      }

      this.alert.setVisible(true);
      this.alert.container.classList.add("alert-success");
      this.alert.container.classList.remove("alert-danger");
      this.alert.setMessage(`Se restauró ${r.name} correctamente`);

      setTimeout(() => {
        this.alert.setVisible(false);
      }, 5000);
    });
  }

  async refreshTable(): Promise<void> {
    const response = await fetch(this.url);
    const data: BackupSearch = await response.json();

    const backupsArray: Backup[] = data.backups.map((backup) => ({
      name: backup,
    }));

    this.table.lastSearch = {
      criteria: {},
      totalPages: data.totalPages,
      currentPage: data.page,
      result: backupsArray,
    };

    this.table.render();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new BackupsView();
});
