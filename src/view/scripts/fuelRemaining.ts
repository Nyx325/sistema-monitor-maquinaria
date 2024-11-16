import { FuelRemainingWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { View } from "./view.js";

class FuelRemainingView extends View<FuelRemainingWithSnapshot> {
  constructor() {
    super({
      adapterEndpoint: "combustibleRestante",
      alert: "alert",
      modalId: "modal",
      tableId: "records",
      legend: "form-title",
      aceptBtn: "acept",
      cancelBtn: "cancel",
      addBtn: "add",
      updateBtn: "update",
      deleteBtn: "delete",
      pagerContainer: "pager",
      activity: {
        container: "activity-section",
        true: "active-true",
        false: "active-false",
      },
      inputs: [
        {
          key: "serialNumber",
          inputOpts: {
            containerId: "serial-number",
            labelId: "serial-number-label",
            inputId: "serial-number-input",
          },
        },
        {
          key: "percent",
          inputOpts: {
            containerId: "percent",
            labelId: "percent-label",
            inputId: "percent-input",
          },
        },
        {
          key: "datetime",
          inputOpts: {
            containerId: "datetime",
            labelId: "datetime-label",
            inputId: "datetime-input",
          },
        },
      ],
    });
  }

  protected initialize(): void {
    super.initialize();
    this.initTable().then();
  }

  protected async initTable(): Promise<void> {
    await super.initTable({
      title: "Combustible restante",
      headers: ["Numero de serie", "Fecha y hora", "Combustible restante (%)"],
    });

    this.table.onParseData((record) => {
      return [
        `${record.snapshot?.serial_number}`,
        `${record.date_time}`,
        `${record.percent}`,
      ];
    });

    this.table.lastSearch = {
      result: [],
      criteria: { active: true },
      totalPages: 1,
      currentPage: 1,
    };

    this.refreshTable();
  }

  protected initForm(): void {
    super.initForm();
    this.form.aceptBtn.addEventListener("click", async () => {
      const i = this.form.inputs;
      const serial_number = i.serialNumber.getValue();
      const date_time = i.datetime.getValue();
      const active = this.form.activity.getSelection();
      const percent = i.percent.getValue();

      let fuel;
      let response;
      if (this.form.adding) {
        fuel = {
          date_time,
          serial_number,
          percent,
        };
        response = await this.adapter.add(fuel);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const selected = this.table.lastSelected.record;

        fuel = {
          fuel_remaining_id: selected.fuel_remaining_id,
          date_time,
          percent,
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

  protected addBtnAction(): void {}

  protected updateBtnAction(record: FuelRemainingWithSnapshot) {
    const i = this.form.inputs;
    i.serialNumber.setValue(record.snapshot?.serial_number);
    i.percent.setValue(record.percent);
    i.datetime.setValue(record.date_time);
    this.form.activity.setSelection(record.active);
  }

  protected getRecordId(record: FuelRemainingWithSnapshot) {
    return record.fuel_remaining_id;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new FuelRemainingView();
});
