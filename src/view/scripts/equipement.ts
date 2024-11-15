import { Equipement } from "@prisma/client";
import { View } from "./view.js";

class EquipementView extends View<Equipement> {
  constructor() {
    super({
      adapterEndpoint: "equipos",
      alert: "equipement-alert",
      modalId: "equipement-modal",
      tableId: "equipement-records",
      legend: "form-title",
      activity: {
        container: "activity-section",
        true: "active-true",
        false: "active-false",
      },
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
          key: "model",
          inputOpts: {
            inputId: "model-input",
            labelId: "model-label",
            containerId: "model",
          },
        },
        {
          key: "oem",
          inputOpts: {
            inputId: "oem-input",
            labelId: "oem-label",
            containerId: "oem",
          },
        },
      ],
      aceptBtn: "acept-btn",
      cancelBtn: "cancel-btn",
      addBtn: "add-equipement",
      updateBtn: "update-equipement",
      deleteBtn: "delete-equipement",
      pagerContainer: "pager",
    });
  }

  protected initialize(): void {
    super.initialize();
    this.initTable().then();
    this.pager.render();
  }

  protected async initTable(): Promise<void> {
    await super.initTable({
      title: "Equipos",
      headers: ["Número de serie", "Modelo", "OEM"],
    });

    this.table.onParseData((record) => {
      return [
        `${record.serial_number}`,
        `${record.model}`,
        `${record.oem_name}`,
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
      const oem_name = i.oem.getValue();
      const model = i.model.getValue();
      const active = this.form.activity.getSelection();

      let record;
      let res;
      if (this.form.adding) {
        record = {
          serial_number,
          oem_name,
          model,
        };

        res = await this.adapter.add(record);
      } else {
        record = {
          serial_number,
          oem_name,
          model,
          active,
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

  protected addBtnAction(): void {
    this.form.legend.innerText = "Agregar un equipo";
    this.form.activity.setVisible(false);
    this.form.inputs.serialNumber.disabled(false);
  }

  protected updateBtnAction(record: Equipement): void {
    this.form.legend.innerText = "Actualizar equipo";
    this.form.activity.setVisible(true);
    this.form.inputs.serialNumber.disabled(true);

    const i = this.form.inputs;
    i.serialNumber.setValue(record.serial_number);
    i.model.setValue(record.model);
    i.oem.setValue(record.oem_name);
    this.form.activity.setSelection(record.active);
  }

  protected getRecordId(record: Equipement): unknown {
    return record.serial_number;
  }
}

// Inicialización del manager cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  new EquipementView();
});
