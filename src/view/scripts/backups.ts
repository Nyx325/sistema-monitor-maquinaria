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
  protected modal: Modal;
  protected table: Table<Backup>;
  protected pager: Pager<Backup>;

  constructor() {
    this.modal = new Modal("modal");
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
    this.table.setHeaders(["Respaldos"]);
    this.table.onParseData((r) => {
      return [r.name];
    });
  }

  async refreshTable(): Promise<void> {
    const url = `http://${document.location.host}/api/backups`;
    const response = await fetch(url);
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
