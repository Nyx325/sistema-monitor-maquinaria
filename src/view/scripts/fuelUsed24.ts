import Alert from "../components/alert.js";
import Modal from "../components/modal.js";
import { Table } from "../components/table.js";
import { FuelUsed24WithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { Adapter } from "../adapters/Adapter.js";
import { Search } from "../../model/entities/Search.js";

class FuelUsed24View {
  private form: {
    alert: Alert;
    legend: HTMLLegendElement;
    adding: boolean;
    inputs: {
      serialNumberI: HTMLInputElement;
      fuelConsumedI: HTMLInputElement;
      fuelUnitsI: HTMLInputElement;
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

  private modal: Modal;
  private table: Table<FuelUsed24WithSnapshot>;
  private adapter: Adapter = new Adapter("combustibleUsado24");

  constructor() {
    this.table = new Table("fuel-used-records");
    this.modal = new Modal("fuel-used-modal");

    this.form = {
      alert: new Alert("fuel-used-alert"),
      legend: document.getElementById("form-title") as HTMLLegendElement,
      adding: false,
      inputs: {
        serialNumberI: document.getElementById(
          "serial-number-input",
        ) as HTMLInputElement,
        dateTimeI: document.getElementById(
          "datetime-input",
        ) as HTMLInputElement,
        fuelConsumedI: document.getElementById(
          "fuel-consumed-input",
        ) as HTMLInputElement,
        fuelUnitsI: document.getElementById(
          "fuel-units-input",
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
      add: document.getElementById("add-fuel-used") as HTMLButtonElement,
      update: document.getElementById("update-fuel-used") as HTMLButtonElement,
      delete: document.getElementById("delete-fuel-used") as HTMLButtonElement,
    };

    this.initialize();
  }

  private initialize() {
    Promise.all([
      this.initTable(),
      this.initCrudBtns(),
      this.initForm(),
    ]).then();
  }

  private async initTable() {
    this.table.setTitle("Combustible usado las ultimas 24 horas");

    this.table.setHeaders([
      "Numero de serie",
      "Fecha y hora",
      "Combustible consumido",
      "Unidades combustible",
    ]);

    this.table.onParseData((record) => {
      return [
        String(record.snapshot?.serial_number),
        String(record.date_time),
        String(record.fuel_consumed),
        String(record.fuel_units),
      ];
    });

    this.refreshTable();
  }

  private async refreshTable() {
    const lastS = this.table.lastSearch;

    const response = await this.adapter.getBy(
      lastS?.criteria ?? { active: true },
      lastS?.currentPage ?? 1,
    );

    if (response.status >= 400) {
      const e = JSON.parse(await response.text());
      console.error(e.message);
      return;
    }

    const search: Search<FuelUsed24WithSnapshot> = JSON.parse(
      await response.text(),
    );

    this.table.lastSearch = search;
    this.table.render();
  }

  private initCrudBtns(): void {
    this.crudBtns.add.addEventListener("click", () => {
      this.form.inputs.serialNumberI.classList.remove("d-none");
      this.form.activity.container.classList.add("d-none");
      this.form.adding = true;
      this.modal.show(true);
    });

    this.crudBtns.update.addEventListener("click", () => {
      this.form.adding = false;
      const lastSelected = this.table.lastSelected;
      if (!lastSelected) return;

      const f = lastSelected.record;

      const { fuelConsumedI, fuelUnitsI, dateTimeI } = this.form.inputs;

      fuelUnitsI.value = String(f.fuel_units);
      fuelConsumedI.value = String(f.fuel_consumed);
      dateTimeI.value = String(f.date_time);

      this.form.inputs.serialNumberI.classList.add("d-none");
      this.form.activity.container.classList.remove("d-none");
      this.setActivitySelection(!!f.active);

      this.modal.show(true);
    });

    this.crudBtns.delete.addEventListener("click", async () => {
      const lastSelected = this.table.lastSelected;
      if (!lastSelected) return;

      const f = lastSelected.record;
      const response = await this.adapter.delete(f.fuel_used_id as number);
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
      const inputs = this.form.inputs;
      const serial_number = inputs.serialNumberI.value.trim();
      const fuel_consumed = inputs.fuelConsumedI.value.trim();
      const fuel_units = inputs.fuelUnitsI.value.trim();
      const date_time = inputs.dateTimeI.value.trim();
      const active = this.getActivitySelection();

      let fuel;
      let response;

      if (this.form.adding) {
        fuel = {
          date_time,
          serial_number,
          fuel_consumed,
          fuel_units,
        };
        response = await this.adapter.add(fuel);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const selected = this.table.lastSelected.record;

        fuel = {
          fuel_used_id: selected.fuel_used_id,
          fuel_consumed,
          date_time,
          fuel_units,
          active,
          snapshot_id: selected.snapshot_id,
        };

        response = await this.adapter.update(fuel);
      }

      if (response.status >= 400) {
        const e = JSON.parse(await response.text());
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
  new FuelUsed24View();
});
