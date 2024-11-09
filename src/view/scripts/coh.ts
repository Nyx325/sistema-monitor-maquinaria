import { Adapter } from "../adapters/Adapter.js";
import Alert from "../components/alert.js";
import Modal from "../components/modal.js";
import { Table } from "../components/table.js";
import { COHWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { Search } from "../../model/entities/Search.js";

class COHView {
  private form: {
    alert: Alert;
    legend: HTMLLegendElement;
    adding: boolean;
    inputs: {
      serialNumberI: HTMLInputElement;
      hoursI: HTMLInputElement;
      dateTimeI: HTMLInputElement;
    };
    activity: {
      container: HTMLElement;
      true: HTMLInputElement;
      false: HTMLInputElement;
    };
    aceptBtn: HTMLButtonElement;
    cancelBtn: HTMLButtonElement;
  };

  private crudBtns: {
    add: HTMLButtonElement;
    update: HTMLButtonElement;
    delete: HTMLButtonElement;
  };

  private table: Table<COHWithSnapshot>;
  private modal: Modal;
  private adapter: Adapter = new Adapter("coh");
  private adapterSnapshot: Adapter = new Adapter("snapshot");

  constructor() {
    this.table = new Table("coh-records");
    this.modal = new Modal("coh-modal");

    this.form = {
      adding: false,
      alert: new Alert("coh-alert"),
      legend: document.getElementById("form-title") as HTMLLegendElement,
      inputs: {
        serialNumberI: document.getElementById(
          "serial-number-input",
        ) as HTMLInputElement,
        hoursI: document.getElementById("hour-input") as HTMLInputElement,
        dateTimeI: document.getElementById(
          "datetime-input",
        ) as HTMLInputElement,
      },
      activity: {
        container: document.getElementById("activity-section") as HTMLElement,
        true: document.getElementById("active-true") as HTMLInputElement,
        false: document.getElementById("active-false") as HTMLInputElement,
      },
      aceptBtn: document.getElementById("acept-btn") as HTMLButtonElement,
      cancelBtn: document.getElementById("cancel-btn") as HTMLButtonElement,
    };

    this.crudBtns = {
      add: document.getElementById("add-coh") as HTMLButtonElement,
      delete: document.getElementById("delete-coh") as HTMLButtonElement,
      update: document.getElementById("update-coh") as HTMLButtonElement,
    };

    this.initialize();
  }

  private initialize(): void {
    Promise.all([
      this.initTable(),
      this.initCrudBtns(),
      this.initForm(),
    ]).then();
  }

  private async initTable(): Promise<void> {
    this.table.setTitle("Horas operativas acumuladas");

    this.table.setHeaders([
      "Numero de serie",
      "Fecha y hora",
      "Acumulado de horas",
    ]);

    this.table.onParseData((record) => {
      return [
        String(record.snapshot?.serial_number),
        String(record.date_time),
        String(record.hour),
      ];
    });

    this.refreshTable();
  }

  private async refreshTable() {
    const lastS = this.table.lastSearch;

    const res = await this.adapter.getBy(
      lastS?.criteria ?? { active: true },
      lastS?.currentPage ?? 1,
    );

    if (res.status >= 400) {
      const e = JSON.parse(await res.text());
      console.error(e.message);
      return;
    }

    const search: Search<COHWithSnapshot> = JSON.parse(await res.text());
    this.table.lastSearch = search;
    this.table.render();
  }

  private initCrudBtns() {
    this.crudBtns.add.addEventListener("click", () => {
      this.form.inputs.serialNumberI.classList.remove("d-none");
      this.form.activity.container.classList.add("d-none");
      this.form.adding = true;
      this.modal.show(true);
    });

    this.crudBtns.update.addEventListener("click", () => {
      this.form.adding = false;
      const lastS = this.table.lastSelected;
      if (lastS === undefined) return;

      const coh = lastS.record;
      const { hoursI, dateTimeI } = this.form.inputs;
      hoursI.value = String(coh.hour);
      dateTimeI.value = String(coh.date_time);

      this.form.inputs.serialNumberI.classList.add("d-none");
      this.form.activity.container.classList.remove("d-none");
      this.setActivitySelection(coh.active);

      this.modal.show(true);
    });

    this.crudBtns.delete.addEventListener("click", async () => {
      const lastSelected = this.table.lastSelected;
      if (!lastSelected) return;

      const coh = lastSelected.record;
      const response = await this.adapter.delete(coh.coh_id);
      if (response.status >= 400) {
        const e = JSON.parse(await response.text());
        console.error(e.message);
      }

      this.refreshTable();
    });
  }

  private getActivitySelection(): boolean | undefined {
    if (this.form.activity.true.checked) return true;
    if (this.form.activity.false.checked) return false;
    return undefined;
  }

  private setActivitySelection(value: boolean): void {
    this.form.activity.true.checked = value;
    this.form.activity.false.checked = !value;
  }

  private clearFormFields(): void {
    Object.values(this.form.inputs).forEach((input) => {
      input.value = "";
    });
  }

  private initForm() {
    this.form.cancelBtn.addEventListener("click", () => {
      Promise.all([
        this.form.alert.setVisible(false),
        this.modal.show(false),
        this.clearFormFields(),
      ]).then();
    });

    this.form.aceptBtn.addEventListener("click", async () => {
      const { serialNumberI, dateTimeI, hoursI } = this.form.inputs;
      const serial_number = serialNumberI.value.trim();
      const date_time = dateTimeI.value.trim();
      const hour = hoursI.value.trim();

      let coh;
      let res;
      if (this.form.adding) {
        coh = {
          serial_number,
          date_time,
          hour,
        };

        res = await this.adapter.add(coh);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const sel = this.table.lastSelected.record;
        coh = {
          coh_id: sel.coh_id,
          hour,
          date_time,
          active: this.getActivitySelection(),
          snapshot_id: sel.snapshot_id,
        };

        res = await this.adapter.update(coh);
      }

      if (res.status >= 400) {
        const e = JSON.parse(await res.text());
        this.form.alert.setMessage(e.message);
        this.form.alert.setVisible(true);
        return;
      }

      this.form.alert.setVisible(false);
      this.modal.show(false);
      this.refreshTable();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new COHView();
});
