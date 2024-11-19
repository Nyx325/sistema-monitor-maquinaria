import { CPTWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { View } from "./view.js";

class CPTView extends View<CPTWithSnapshot> {
  constructor() {
    super({
      adapterEndpoint: "cpt",
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
          key: "payload",
          inputOpts: {
            containerId: "payload",
            labelId: "payload-label",
            inputId: "payload-input",
          },
        },
        {
          key: "payloadUnits",
          inputOpts: {
            containerId: "payload-units",
            labelId: "payload-units-label",
            inputId: "payload-units-input",
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
      title: "Carga util acumulada",
      headers: ["Numero de serie", "Fecha y hora", "Carga", "Unidades"],
    });

    this.table.onParseData((record) => {
      return [
        `${record.snapshot?.serial_number}`,
        `${record.date_time}`,
        `${record.payload}`,
        `${record.payload_units}`,
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
      const payload = i.payload.getValue();
      const payload_units = i.payloadUnits.getValue();

      let fuel;
      let response;
      if (this.form.adding) {
        fuel = {
          date_time,
          serial_number,
          payload,
          payload_units,
        };
        response = await this.adapter.add(fuel);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const selected = this.table.lastSelected.record;

        fuel = {
          cpt_id: selected.cpt_id,
          date_time,
          payload,
          payload_units,
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

  protected updateBtnAction(record: CPTWithSnapshot) {
    const i = this.form.inputs;
    i.serialNumber.setValue(record.snapshot?.serial_number);
    i.payload.setValue(record.payload);
    i.payloadUnits.setValue(record.payload_units);
    i.datetime.setValue(record.date_time);
    this.form.activity.setSelection(record.active);
  }

  protected getRecordId(record: CPTWithSnapshot) {
    return record.cpt_id;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CPTView();
});
