import { FuelUsedWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { View } from "./view.js";

class FuelUsedView extends View<FuelUsedWithSnapshot> {
  constructor() {
    super({
      adapterEndpoint: "combustibleUsado",
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
          key: "fuelConsumed",
          inputOpts: {
            containerId: "fuel-consumed",
            labelId: "fuel-consumed-label",
            inputId: "fuel-consumed-input",
          },
        },
        {
          key: "fuelUnits",
          inputOpts: {
            containerId: "fuel-units",
            labelId: "fuel-units-label",
            inputId: "fuel-units-input",
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
      title: "Combustible usado",
      headers: [
        "Numero de serie",
        "Fecha y hora",
        "Combustible consumido",
        "Unidades combustible",
      ],
    });

    this.table.onParseData((record) => {
      return [
        `${record.snapshot?.serial_number}`,
        `${record.date_time}`,
        `${record.fuel_consumed}`,
        `${record.fuel_units}`,
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
      const fuel_consumed = i.fuelConsumed.getValue();
      const fuel_units = i.fuelUnits.getValue();
      const date_time = i.datetime.getValue();
      const active = this.form.activity.getSelection();

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

  protected addBtnAction(): void {}

  protected updateBtnAction(record: FuelUsedWithSnapshot) {
    const i = this.form.inputs;
    i.serialNumber.setValue(record.snapshot?.serial_number);
    i.fuelConsumed.setValue(record.fuel_consumed);
    i.fuelUnits.setValue(record.fuel_units);
    i.datetime.setValue(record.date_time);
    this.form.activity.setSelection(record.active);
  }

  protected getRecordId(record: FuelUsedWithSnapshot) {
    return record.fuel_used_id;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new FuelUsedView();
});
