import { DistanceWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { View } from "./view.js";

/*
    distance_id: number;
    active: boolean;
    date_time: Date;
    odometer: number;
    odometer_units: string;
    snapshot_id: number | null;
*/

class DistanceView extends View<DistanceWithSnapshot> {
  constructor() {
    super({
      alert: "distance-alert",
      legend: "form-title",
      activity: {
        container: "activity-section",
        true: "active-true",
        false: "active-false",
      },
      aceptBtn: "acept-btn",
      cancelBtn: "cancel-btn",
      addBtn: "add-distance",
      updateBtn: "update-distance",
      deleteBtn: "delete-distance",
      modalId: "distance-modal",
      tableId: "distance-records",
      adapterEndpoint: "distancia",
      inputs: [
        {
          key: "serialNumber",
          inputOpts: {
            inputId: "serial-number-input",
            labelId: "serial-number-label",
            containerId: "serial-number",
          },
        },
        {
          key: "odometer",
          inputOpts: {
            containerId: "odometer",
            labelId: "odometer-label",
            inputId: "odometer-input",
          },
        },
        {
          key: "odometerUnits",
          inputOpts: {
            containerId: "odometer-units",
            labelId: "odometer-units-label",
            inputId: "odometer-units-input",
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
    this.initCrudBtns();
  }

  protected initForm(): void {
    super.initForm();
    this.form.aceptBtn.addEventListener("click", async () => {
      const i = this.form.inputs;
      const serial_number = i.serialNumber.getValue();
      const date_time = i.datetime.getValue();
      const odometer = i.odometer.getValue();
      const odometer_units = i.odometerUnits.getValue();
      const active = this.form.activity.getSelection();

      let coh;
      let res;
      if (this.form.adding) {
        coh = {
          serial_number,
          date_time,
          odometer,
          odometer_units,
        };

        res = await this.adapter.add(coh);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const sel = this.table.lastSelected.record;
        coh = {
          distance_id: sel.distance_id,
          date_time,
          odometer,
          odometer_units,
          active,
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

  protected async initTable(): Promise<void> {
    await super.initTable({
      title: "Distancia recorrida",
      headers: [
        "Número de serie",
        "Fecha y hora",
        "Valor odómetro",
        "Unidades odómetro",
      ],
    });

    this.table.onParseData((record) => {
      return [
        String(record.snapshot?.serial_number),
        String(record.date_time),
        String(record.odometer),
        String(record.odometer_units),
      ];
    });
  }

  protected addBtnAction(): void {
    this.form.activity.setVisible(false);
    this.form.inputs.serialNumber.setVisible(true);
  }

  protected updateBtnAction(record: DistanceWithSnapshot): void {
    this.form.activity.setVisible(true);
    this.form.inputs.serialNumber.setVisible(false);

    const i = this.form.inputs;
    i.odometer.setValue(record.odometer);
    i.odometerUnits.setValue(record.odometer_units);
    i.datetime.setValue(record.date_time);
    this.form.activity.setSelection(record.active);
  }

  protected getRecordId(record: DistanceWithSnapshot): unknown {
    return record.distance_id;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new DistanceView();
});
