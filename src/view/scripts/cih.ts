import { CIHWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { View } from "./view.js";

class CIHView extends View<CIHWithSnapshot> {
  constructor() {
    super({
      alert: "cih-alert",
      legend: "form-title",
      activity: {
        container: "activity-section",
        true: "active-true",
        false: "active-false",
      },
      aceptBtn: "acept-btn",
      cancelBtn: "cancel-btn",
      addBtn: "add-cih",
      updateBtn: "update-cih",
      deleteBtn: "delete-cih",
      modalId: "cih-modal",
      tableId: "cih-records",
      adapterEndpoint: "cih",
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
          key: "hour",
          inputOpts: {
            containerId: "hour",
            labelId: "hour-label",
            inputId: "hour-input",
          },
        },
        {
          key: "dateTime",
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
      title: "Horas inactivas acumuladas",
      headers: ["Número de serie", "Fecha y hora", "Horas"],
    });

    this.table.onParseData((record) => {
      return [
        String(record.snapshot?.serial_number),
        String(record.date_time),
        String(record.hour),
      ];
    });
  }

  protected addBtnAction(): void {
    this.form.legend.innerText = "Agregar un registro";
    this.form.activity.setVisible(false);
    this.form.inputs.serialNumber.setVisible(true);
  }

  protected getRecordId(record: CIHWithSnapshot): unknown {
    return record.cih_id;
  }

  protected updateBtnAction(record: CIHWithSnapshot): void {
    this.form.legend.innerText = "Actualizar un registro";
    this.form.activity.setVisible(true);
    this.form.inputs.serialNumber.setVisible(false);

    const i = this.form.inputs;
    i.hour.setValue(record.hour);
    i.dateTime.setValue(record.date_time);
    this.form.activity.setSelection(record.active);
  }

  protected initForm(): void {
    super.initForm();
    this.form.aceptBtn.addEventListener("click", async () => {
      const i = this.form.inputs;
      const serial_number = i.serialNumber.getValue();
      const date_time = i.dateTime.getValue();
      const active = this.form.activity.getSelection();
      const hour = i.hour.getValue();

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
          date_time,
          active,
          snapshot_id: sel.snapshot_id,
          hour,
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
  new CIHView();
});
