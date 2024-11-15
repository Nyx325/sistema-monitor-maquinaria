import { COHWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { View } from "./view.js";

class COHView extends View<COHWithSnapshot> {
  constructor() {
    super({
      adapterEndpoint: "coh",
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
          key: "hours",
          inputOpts: {
            containerId: "hours",
            inputId: "hours-input",
            labelId: "hours-label",
          },
        },
        {
          key: "datetime",
          inputOpts: {
            containerId: "datetime",
            inputId: "datetime-input",
            labelId: "datetime-label",
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
      title: "Horas operativas acumuladas",
      headers: ["Número de serie", "Fecha y hora", "Horas"],
    });

    this.table.onParseData((record) => {
      return [
        `${record.snapshot?.serial_number}`,
        `${record.date_time}`,
        `${record.hour}`,
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
      const hour = i.hours.getValue();
      const date_time = i.datetime.getValue();
      const active = this.form.activity.getSelection();

      let res;
      if (this.form.adding) {
        const record = {
          serial_number,
          hour,
          date_time,
        };

        res = await this.adapter.add(record);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const s = this.table.lastSelected.record;
        const record = {
          coh_id: s.coh_id,
          hour,
          date_time,
          active,
          snapshot_id: s.snapshot_id,
        };
        res = await this.adapter.update(record);
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

  protected addBtnAction(): void {}

  protected updateBtnAction(record: COHWithSnapshot): void {
    const i = this.form.inputs;
    i.serialNumber.setValue(record.snapshot?.serial_number);
    i.hours.setValue(record.hour);
    i.datetime.setValue(record.date_time);
    this.form.activity.setSelection(record.active);
  }

  protected getRecordId(record: COHWithSnapshot): unknown {
    return record.coh_id;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new COHView();
});
