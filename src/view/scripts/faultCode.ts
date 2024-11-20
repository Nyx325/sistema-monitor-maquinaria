import { FaultCodeWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { View } from "./view.js";

class FaultCodeView extends View<FaultCodeWithSnapshot> {
  constructor() {
    super({
      adapterEndpoint: "codigosError",
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
          key: "codeIdentifier",
          inputOpts: {
            containerId: "code-indentifier",
            labelId: "code-indentifier-label",
            inputId: "code-identifier-input",
          },
        },
        {
          key: "codeDescription",
          inputOpts: {
            containerId: "code-description",
            labelId: "code-description-label",
            inputId: "code-description-input",
          },
        },
        {
          key: "codeSeverity",
          inputOpts: {
            containerId: "code-severity",
            labelId: "code-severity-label",
            inputId: "code-severity-input",
          },
        },
        {
          key: "codeSource",
          inputOpts: {
            containerId: "code-source",
            labelId: "code-source-label",
            inputId: "code-source-input",
          },
        },
        {
          key: "airTemperature",
          inputOpts: {
            containerId: "air-temperature",
            labelId: "air-temperature-label",
            inputId: "air-temperature-input",
          },
        },
        {
          key: "temperatureUnit",
          inputOpts: {
            containerId: "temperature-unit",
            labelId: "temperature-unit-label",
            inputId: "temperature-unit-input",
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

    const keys = Object.keys(this.form.inputs);
    for (const key of keys) {
      console.log(key);
      console.log(this.form.inputs[key].input);
    }
  }

  protected initialize(): void {
    super.initialize();
    this.initTable().then();
  }

  protected async initTable(): Promise<void> {
    await super.initTable({
      title: "Carga util acumulada",
      headers: [
        "Numero de serie",
        "Fecha y hora",
        "ID",
        "Descripcion",
        "Gravedad",
        "Severidad",
      ],
    });

    this.table.onParseData((record) => {
      return [
        `${record.snapshot?.serial_number}`,
        `${record.date_time}`,
        `${record.code_identifier}`,
        `${record.code_description}`,
        `${record.code_severity}`,
        `${record.code_source}`,
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
      const code_identifier = i.codeIdentifier.getValue();
      const code_description = i.codeDescription.getValue();
      const code_severity = i.codeSeverity.getValue();
      const code_source = i.codeSource.getValue();
      const air_temperature = i.airTemperature.getValue();
      const temperature_unit = i.temperatureUnit.getValue();

      let fuel;
      let response;
      if (this.form.adding) {
        fuel = {
          date_time,
          serial_number,
          code_severity,
          code_identifier,
          code_description,
          code_source,
          air_temperature,
          temperature_unit,
        };
        response = await this.adapter.add(fuel);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const selected = this.table.lastSelected.record;

        fuel = {
          folio: selected.folio,
          date_time,
          active,
          snapshot_id: selected.snapshot_id,
          code_severity,
          code_identifier,
          code_description,
          code_source,
          air_temperature,
          temperature_unit,
        };

        response = await this.adapter.update(fuel);
      }

      console.log(fuel.folio);

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

  protected updateBtnAction(record: FaultCodeWithSnapshot) {
    const i = this.form.inputs;
    i.serialNumber.setVisible(false);
    i.datetime.setValue(record.date_time);
    this.form.activity.setSelection(record.active);
    i.codeIdentifier.setValue(record.code_identifier);
    i.codeDescription.setValue(record.code_description);
    i.codeSeverity.setValue(record.code_severity);
    i.codeSource.setValue(record.code_source);
    i.airTemperature.setValue(record.air_temperature);
    i.temperatureUnit.setValue(record.temperature_unit);
  }

  protected getRecordId(record: FaultCodeWithSnapshot) {
    return record.folio;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new FaultCodeView();
});
