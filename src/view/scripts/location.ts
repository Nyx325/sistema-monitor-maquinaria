import { Table } from "../components/table.js";
import { Adapter } from "../adapters/Adapter.js";
import Modal from "../components/modal.js";
import Alert from "../components/alert.js";
import { Search } from "../../model/entities/Search.js";
import { LocationWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";

class LocationView {
  private form: {
    alert: Alert;
    legend: HTMLLegendElement;
    adding: boolean;
    inputs: {
      serialNumber: HTMLInputElement;
      longitude: HTMLInputElement;
      latitude: HTMLInputElement;
      altitude: HTMLInputElement;
      altitudeUnits: HTMLInputElement;
      chinaId: HTMLInputElement;
      dateTime: HTMLInputElement;
    };
    activitySection: {
      container: HTMLElement;
      true: HTMLInputElement;
      false: HTMLInputElement;
    };
    aceptBtn: HTMLButtonElement;
    cancelBtn: HTMLButtonElement;
  };

  private crudBtns: {
    add: HTMLButtonElement;
    update: HTMLButtonElement;
    delete: HTMLButtonElement;
  };

  private modal: Modal;
  private table: Table<LocationWithSnapshot>;
  private adapter: Adapter = new Adapter("localizacion");

  constructor() {
    this.table = new Table("location-records");
    this.modal = new Modal("location-modal");

    this.form = {
      alert: new Alert("location-alert"),
      legend: document.getElementById("form-title") as HTMLLegendElement,
      adding: false,
      inputs: {
        serialNumber: document.getElementById(
          "serial-number-input",
        ) as HTMLInputElement,
        chinaId: document.getElementById("china-id-input") as HTMLInputElement,
        altitude: document.getElementById("altitude-input") as HTMLInputElement,
        longitude: document.getElementById(
          "longitude-input",
        ) as HTMLInputElement,
        latitude: document.getElementById("latitude-input") as HTMLInputElement,
        altitudeUnits: document.getElementById(
          "altitude-units-input",
        ) as HTMLInputElement,
        dateTime: document.getElementById("datetime-input") as HTMLInputElement,
      },
      activitySection: {
        container: document.getElementById("activity-section") as HTMLElement,
        true: document.getElementById("active-true") as HTMLInputElement,
        false: document.getElementById("active-false") as HTMLInputElement,
      },
      aceptBtn: document.getElementById("acept-btn") as HTMLButtonElement,
      cancelBtn: document.getElementById("cancel-btn") as HTMLButtonElement,
    };

    this.crudBtns = {
      add: document.getElementById("add-location") as HTMLButtonElement,
      delete: document.getElementById("delete-location") as HTMLButtonElement,
      update: document.getElementById("update-location") as HTMLButtonElement,
    };

    this.initialize();
  }

  private initialize() {
    Promise.all([
      this.initTable().then(),
      this.initCrudBtns(),
      this.initForm(),
    ]).then();
  }

  private async initTable() {
    this.table.setTitle("Localización");

    this.table.setHeaders([
      "Numero de serie",
      "Fecha",
      "Longitud",
      "Latitud",
      "Altitud",
      "Unidades Altitud",
      "ID Coordenadas chinas",
    ]);

    this.table.onParseData((record) => {
      return [
        String(record.snapshot?.serial_number),
        String(record.date_time),
        String(record.longitude),
        String(record.latitude),
        String(record.altitude),
        String(record.altitude_units),
        String(record.china_coordinate_id),
      ];
    });

    this.refreshTable();
  }

  private async refreshTable() {
    const lastS = this.table.lastSearch;

    const response = await this.adapter.getBy(
      lastS?.criteria ?? { active: true },
      lastS?.currentPage ?? 1,
    );

    if (response.status >= 400) {
      const e = JSON.parse(await response.text());
      console.error(e.message);
      return;
    }

    const search: Search<LocationWithSnapshot> = JSON.parse(
      await response.text(),
    );

    this.table.lastSearch = search;
    this.table.render();
  }

  private initCrudBtns(): void {
    this.crudBtns.add.addEventListener("click", () => {
      this.form.inputs.serialNumber.classList.remove("d-none");
      this.form.activitySection.container.classList.add("d-none");
      this.form.adding = true;
      this.modal.show(true);
    });

    this.crudBtns.update.addEventListener("click", () => {
      this.form.adding = false;
      const lastSelected = this.table.lastSelected;
      if (!lastSelected) return;

      const l = lastSelected.record;

      const { longitude, latitude, altitude, altitudeUnits, chinaId } =
        this.form.inputs;

      longitude.value = String(l.longitude);
      latitude.value = String(l.latitude);
      altitude.value = String(l.altitude);
      altitudeUnits.value = String(l.altitude_units);
      chinaId.value = String(l.china_coordinate_id);

      this.form.inputs.serialNumber.classList.add("d-none");
      this.form.activitySection.container.classList.remove("d-none");
      this.setActivitySelection(!!l.active);

      this.modal.show(true);
    });

    this.crudBtns.delete.addEventListener("click", async () => {
      const lastSelected = this.table.lastSelected;
      if (!lastSelected) return;

      const l = lastSelected.record;
      const response = await this.adapter.delete(l.location_id as number);
      if (response.status >= 400) {
        const e = JSON.parse(await response.text());
        console.error(e.message);
      }

      this.refreshTable();
    });
  }

  private getActivitySelection(): boolean | undefined {
    if (this.form.activitySection.true.checked) return true;
    if (this.form.activitySection.false.checked) return false;
    return undefined;
  }

  private setActivitySelection(value: boolean): void {
    this.form.activitySection.true.checked = value;
    this.form.activitySection.false.checked = !value;
  }

  private clearFormFields(): void {
    Object.values(this.form.inputs).forEach((input) => {
      input.value = "";
    });
  }

  private initForm() {
    this.form.cancelBtn.addEventListener("click", () => {
      Promise.all([
        this.form.alert.setVisible(false),
        this.modal.show(false),
        this.clearFormFields(),
      ]).then();
    });

    this.form.aceptBtn.addEventListener("click", async () => {
      const inputs = this.form.inputs;
      const longitude = inputs.longitude.value.trim();
      const latitude = inputs.longitude.value.trim();
      const altitude = inputs.altitude.value.trim();
      const altitude_units = inputs.altitudeUnits.value.trim();
      const china_coordinate_id = inputs.chinaId.value.trim();
      const date_time = inputs.dateTime.value.trim();
      const serial_number = inputs.serialNumber.value.trim();
      const active = this.getActivitySelection();

      let location;
      let response;

      if (this.form.adding) {
        location = {
          date_time,
          china_coordinate_id,
          altitude_units,
          longitude,
          altitude,
          latitude,
          serial_number,
        };
        response = await this.adapter.add(location);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const selected = this.table.lastSelected;

        location = {
          location_id: selected.record.location_id,
          snapshot_id: selected.record.snapshot_id,
          active,
          date_time,
          china_coordinate_id,
          altitude_units,
          longitude,
          altitude,
          latitude,
        };

        response = await this.adapter.update(location);
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
}

document.addEventListener("DOMContentLoaded", () => {
  new LocationView();
});
