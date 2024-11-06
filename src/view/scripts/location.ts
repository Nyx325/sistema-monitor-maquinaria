import { Table } from "../components/table.js";
import LocationAdapter from "../adapters/infraestructure/LocationAdapter.js";
import { Search } from "../adapters/models/search.js";
import Modal from "../components/modal.js";

class LocationView {
  private form: {
    legend: HTMLLegendElement;
    adding: boolean;
    inputs: {
      longitude: HTMLInputElement;
      latitude: HTMLInputElement;
      altitude: HTMLInputElement;
      altitudeUnits: HTMLInputElement;
      chinaId: HTMLInputElement;
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
  private table: Table;
  private adapter: LocationAdapter = new LocationAdapter();

  constructor() {
    this.table = new Table("location-records");
    this.modal = new Modal("location-modal");

    this.form = {
      legend: document.getElementById("form-title") as HTMLLegendElement,
      adding: false,
      inputs: {
        chinaId: document.getElementById("china-id-input") as HTMLInputElement,
        altitude: document.getElementById("altitude-input") as HTMLInputElement,
        longitude: document.getElementById(
          "longitude-input",
        ) as HTMLInputElement,
        latitude: document.getElementById("latitude-input") as HTMLInputElement,
        altitudeUnits: document.getElementById(
          "altitude-units-input",
        ) as HTMLInputElement,
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
    this.initTable().then();
    this.initCrudBtns();
  }

  private async initTable() {
    this.table.setTitle("Localización");

    this.table.setHeaders([
      "Fecha",
      "Longitud",
      "Latitud",
      "Altitud",
      "Unidades Altitud",
      "ID Coordenadas chinas",
    ]);

    this.table.onParseData((record) => {
      return [
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
    console.log("Last search: ");
    console.log(lastS);

    const response = await this.adapter.getBy(
      lastS?.criteria ?? { active: true },
      lastS?.currentPage ?? 1,
    );

    if (response.status >= 400) {
      const e = JSON.parse(await response.text());
      console.error(e.message);
      return;
    }

    const search: Search = JSON.parse(await response.text());
    console.log("Search");
    console.log(search);
    this.table.lastSearch = search;
    this.table.render();
  }

  private initCrudBtns(): void {
    this.crudBtns.add.addEventListener("click", () => {
      this.form.activitySection.container.classList.add("d-none");
      this.form.adding = true;
      this.modal.show(true);
    });

    this.crudBtns.update.addEventListener("click", () => {
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
}

document.addEventListener("DOMContentLoaded", () => {
  new LocationView();
});
