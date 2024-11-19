import { EngineStatusWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { View } from "./view.js";

class EngineStatusView extends View<EngineStatusWithSnapshot> {
  constructor() {
    super({
      adapterEndpoint: "estadoMotor",
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
          key: "engineNumber",
          inputOpts: {
            containerId: "engine-number",
            labelId: "engine-number-label",
            inputId: "engine-number-input",
          },
        },
        {
          key: "running",
          inputOpts: {
            containerId: "running",
            labelId: "running-label",
            inputId: "running-input",
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
      title: "Estado del motor",
      headers: ["Numero de serie", "Fecha y hora", "Número del motor", "Activo"],
    });

    this.table.onParseData((record) => {
      return [
        `${record.snapshot?.serial_number}`,
        `${record.date_time}`,
        `${record.engine_number}`,
        record.running ? "Si" : "No",
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
      
      const engine_number = i.engineNumber.getValue();
      const running = i.running.isChecked();

      let record;
      let response;
      if (this.form.adding) {
        record = {
          date_time,
          serial_number,
          engine_number,
          running
        };

        response = await this.adapter.add(record);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const selected = this.table.lastSelected.record;

        record = {
          engine_status_id: selected.engine_status_id,
          date_time,
          active,
          snapshot_id: selected.snapshot_id,
          running,
          engine_number,
        };

        response = await this.adapter.update(record);
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

  protected addBtnAction(): void {
    const i = this.form.inputs;
    i.serialNumber.setVisible(true);
  }

  protected updateBtnAction(record: EngineStatusWithSnapshot) {
    const i = this.form.inputs;
    i.serialNumber.setVisible(false);
    i.engineNumber.setValue(record.engine_number);
    i.running.setChecked(record.running);
    i.datetime.setValue(record.date_time);
    this.form.activity.setSelection(record.active);
  }

  protected getRecordId(record: EngineStatusWithSnapshot) {
    return record.engine_status_id;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new EngineStatusView();
});
