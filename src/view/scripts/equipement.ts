import Modal from "../components/modal.js";
import { Table } from "../components/table.js";
import Alert from "../components/alert.js";
import { Search } from "../adapters/models/search.js";
import { EquipementAdapter } from "../adapters/infraestructure/EquipementAdapter.js";

class EquipementView {
  private adapter: EquipementAdapter;
  private serialNInput: HTMLInputElement;
  private modelInput: HTMLInputElement;
  private oemInput: HTMLInputElement;
  private aceptBtn: HTMLButtonElement;
  private cancelBtn: HTMLButtonElement;
  private modal: Modal;
  private activeTrue: HTMLInputElement;
  private activeFalse: HTMLInputElement;
  private addBtn: HTMLButtonElement;
  private updateBtn: HTMLButtonElement;
  private deleteBtn: HTMLButtonElement;
  private activitySection: HTMLElement;
  private alert: Alert;
  private table: Table;
  private adding: boolean = false;

  constructor() {
    this.adapter = new EquipementAdapter();

    // Asignación de elementos del DOM
    this.serialNInput = document.getElementById(
      "serial-number-input",
    ) as HTMLInputElement;
    this.modelInput = document.getElementById(
      "model-input",
    ) as HTMLInputElement;
    this.oemInput = document.getElementById("oem-input") as HTMLInputElement;

    this.aceptBtn = document.getElementById("acept-btn") as HTMLButtonElement;
    this.cancelBtn = document.getElementById("cancel-btn") as HTMLButtonElement;

    this.modal = new Modal("equipement-modal");
    this.activeTrue = document.getElementById(
      "active-true",
    ) as HTMLInputElement;
    this.activeFalse = document.getElementById(
      "active-false",
    ) as HTMLInputElement;

    this.addBtn = document.getElementById(
      "add-equipement",
    ) as HTMLButtonElement;
    this.updateBtn = document.getElementById(
      "update-equipement",
    ) as HTMLButtonElement;
    this.deleteBtn = document.getElementById(
      "delete-equipement",
    ) as HTMLButtonElement;

    this.activitySection = document.getElementById(
      "activity-section",
    ) as HTMLElement;
    this.alert = new Alert("equipement-alert");
    this.table = new Table("equipement-records");

    this.initialize();
  }

  private initialize(): void {
    this.initTable().then();
    this.initModal();
    this.initCrudBtns();
    this.initForm();
  }

  private async initTable(): Promise<void> {
    this.table.setTitle("Equipos");
    this.table.setHeaders(["Numero de serie", "OEM", "Modelo"]);

    const response = await this.adapter.getBy({ active: true }, 1);
    const search: Search = JSON.parse(await response.text());

    this.table.onParseData((record) => {
      return [
        String(record.serial_number),
        String(record.oem_name),
        String(record.model),
      ];
    });

    this.table.lastSearch = search;
    this.table.render();
  }

  private initCrudBtns(): void {
    this.addBtn.addEventListener("click", () => {
      this.serialNInput.disabled = false;
      this.activitySection.classList.add("d-none");
      this.adding = true;
      this.modal.show(true);
    });

    this.updateBtn.addEventListener("click", () => {
      const eq = this.table.lastSelected;
      if (!eq) return;

      this.serialNInput.disabled = true;
      this.activitySection.classList.remove("d-none");
      this.adding = false;

      this.serialNInput.value = String(eq.record.serial_number);
      this.modelInput.value = String(eq.record.model);
      this.oemInput.value = String(eq.record.oem_name);
      this.setActivitySelection(eq.record.active as boolean);

      this.modal.show(true);
    });

    this.deleteBtn.addEventListener("click", () => {
      const eq = this.table.lastSelected;
      if (!eq) return;
      this.adapter.delete(eq.record.serial_number as string);
      this.reloadTable();
    });
  }

  private initModal(): void {
    this.cancelBtn.addEventListener("click", () => {
      this.clearForm();
      this.modal.show(false);
    });
  }

  private initForm(): void {
    this.aceptBtn.addEventListener("click", async () => {
      const serial_number = this.serialNInput.value.trim();
      const oem_name = this.oemInput.value.trim();
      const model = this.modelInput.value.trim();
      const active = this.getActivitySelection();

      let response;
      if (this.adding) {
        response = await this.adapter.add({
          serial_number,
          model,
          oem_name,
          active: true,
        });
        this.adding = false;
      } else {
        response = await this.adapter.update({
          serial_number,
          model,
          oem_name,
          active: active ?? false,
        });
      }

      if (response.status >= 400) {
        const res = JSON.parse(await response.text());
        this.alert.setMessage(res.message);
        this.alert.setVisible(true);
      } else {
        this.clearForm();
        this.modal.show(false);
        await this.reloadTable();
      }

      this.clearForm();
    });
  }

  private clearForm(): void {
    this.serialNInput.value = "";
    this.oemInput.value = "";
    this.modelInput.value = "";
  }

  private async reloadTable(): Promise<void> {
    const reload = await this.adapter.getBy(
      this.table.lastSearch?.criteria ?? {},
      this.table.lastSearch?.currentPage ?? 1,
    );

    if (reload.status >= 400) {
      const res = JSON.parse(await reload.text());
      console.error(res.message);

      this.table.lastSearch = {
        currentPage: 1,
        totalPages: 1,
        result: [],
        criteria: {},
      };
    } else {
      const search: Search = JSON.parse(await reload.text());
      this.table.lastSearch = search;
    }

    this.table.render();
  }

  private getActivitySelection(): boolean | undefined {
    if (this.activeTrue.checked) return true;
    if (this.activeFalse.checked) return false;
    return undefined;
  }

  private setActivitySelection(value: boolean): void {
    this.activeTrue.checked = value;
    this.activeFalse.checked = !value;
  }
}

// Inicialización del manager cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  new EquipementView();
});
