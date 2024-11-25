import { LocationWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { Location } from "@prisma/client";
import { Search } from "../../model/entities/Search.js";
import Activity from "../components/activity.js";
import LabeledInput from "../components/labeledInput.js";
import Modal from "../components/modal.js";
import { View } from "./view.js";

class LocationView extends View<LocationWithSnapshot> {
  protected searchModal: Modal;
  protected searchBtn: HTMLButtonElement;
  protected activitySearch: Activity;

  protected search: {
    acept: HTMLButtonElement;
    cancel: HTMLButtonElement;
  };

  protected searchInput: {
    longitude: LabeledInput;
    latitude: LabeledInput;
    altitude: LabeledInput;
    altitudeUnits: LabeledInput;
    chinaId: LabeledInput;
    datetime: LabeledInput;
  };

  constructor() {
    super({
      alert: "location-alert",
      legend: "form-title",
      activity: {
        container: "activity-section",
        true: "active-true",
        false: "active-false",
      },
      aceptBtn: "acept-btn",
      cancelBtn: "cancel-btn",
      addBtn: "add-location",
      updateBtn: "update-location",
      deleteBtn: "delete-location",
      modalId: "location-modal",
      tableId: "location-records",
      adapterEndpoint: "localizacion",
      pagerContainer: "pager",
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
          key: "longitude",
          inputOpts: {
            containerId: "longitude",
            labelId: "longitude-label",
            inputId: "longitude-input",
          },
        },
        {
          key: "latitude",
          inputOpts: {
            containerId: "latitude",
            labelId: "latitude-label",
            inputId: "latitude-input",
          },
        },
        {
          key: "altitude",
          inputOpts: {
            containerId: "altitude",
            labelId: "altitude-label",
            inputId: "altitude-input",
          },
        },
        {
          key: "altitudeUnits",
          inputOpts: {
            containerId: "altitude-units",
            labelId: "altitude-units-label",
            inputId: "altitude-units-input",
          },
        },
        {
          key: "chinaId",
          inputOpts: {
            containerId: "china-id",
            labelId: "china-id-label",
            inputId: "china-id-input",
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

    this.searchBtn = document.getElementById(
      "search-location",
    ) as HTMLButtonElement;
    this.searchModal = new Modal("search-modal");
    this.searchInput = {
      datetime: new LabeledInput({
        inputId: "datetime-inputs",
        labelId: "datetime-labels",
        containerId: "datetimes",
      }),
      chinaId: new LabeledInput({
        containerId: "china-ids",
        inputId: "china-id-inputs",
        labelId: "china-id-labels",
      }),
      altitude: new LabeledInput({
        labelId: "altitude-labels",
        inputId: "altitude-inputs",
        containerId: "altitudes",
      }),
      latitude: new LabeledInput({
        containerId: "latitudes",
        inputId: "latitude-inputs",
        labelId: "latitude-labels",
      }),
      longitude: new LabeledInput({
        containerId: "longitudes",
        labelId: "longitude-labels",
        inputId: "longitude-inputs",
      }),
      altitudeUnits: new LabeledInput({
        containerId: "altitude-unitss",
        inputId: "altitude-inputs",
        labelId: "altitude-labels",
      }),
    };

    this.activitySearch = new Activity({
      container: document.getElementById("activity-sections") as HTMLElement,
      trueI: document.getElementById("active-trues") as HTMLInputElement,
      falseI: document.getElementById("active-falses") as HTMLInputElement,
    });

    this.search = {
      acept: document.getElementById("acept-btns") as HTMLButtonElement,
      cancel: document.getElementById("cancel-btns") as HTMLButtonElement,
    };

    this.initSearchModal();
  }

  protected initialize(): void {
    super.initialize();
    this.initTable().then();
    this.pager.render();
  }

  protected async initTable(): Promise<void> {
    await super.initTable({
      title: "Equipos",
      headers: [
        "Numero de serie",
        "Fecha",
        "Longitud",
        "Latitud",
        "Altitud",
        "Unidades Altitud",
        "ID Coordenadas chinas",
      ],
    });

    this.table.onParseData((record) => {
      return [
        `${record.snapshot?.serial_number}`,
        `${record.date_time}`,
        `${record.longitude}`,
        `${record.latitude}`,
        `${record.altitude}`,
        `${record.altitude_units}`,
        `${record.china_coordinate_id}`,
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
      const longitude = i.longitude.getValue();
      const latitude = i.latitude.getValue();
      const altitude = i.altitude.getValue();
      const altitude_units = i.altitudeUnits.getValue();
      const china_coordinate_id = i.chinaId.getValue();
      const date_time = i.datetime.getValue();
      const active = this.form.activity.getSelection();

      let record;
      let res;
      if (this.form.adding) {
        record = {
          date_time,
          china_coordinate_id,
          altitude_units,
          longitude,
          altitude,
          latitude,
          serial_number,
        };
        res = await this.adapter.add(record);
      } else {
        if (this.table.lastSelected === undefined) {
          console.error("No se seleccionó un elemento");
          return;
        }

        const selected = this.table.lastSelected;

        record = {
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
    this.form.inputs.serialNumber.setVisible(true);
  }

  protected updateBtnAction(record: LocationWithSnapshot): void {
    this.form.inputs.serialNumber.setVisible(false);

    const i = this.form.inputs;
    i.longitude.setValue(record.longitude);
    i.latitude.setValue(record.latitude);
    i.altitude.setValue(record.altitude);
    i.altitudeUnits.setValue(record.altitude_units);
    i.chinaId.setValue(record.china_coordinate_id);
    i.datetime.setValue(record.date_time);
    this.form.activity.setSelection(record.active);
  }

  protected getRecordId(record: LocationWithSnapshot): unknown {
    return record.location_id;
  }

  protected initSearchModal() {
    this.searchBtn.addEventListener("click", () => {
      this.searchModal.show(true);
    });

    this.search.cancel.addEventListener("click", () => {
      this.searchModal.show(false);

      Object.values(this.searchInput).forEach((input) => {
        input.clear();
      });
    });

    this.search.acept.addEventListener("click", () => {
      const {
        longitude,
        latitude,
        altitude,
        altitudeUnits,
        chinaId,
        datetime,
      } = this.searchInput;

      console.log(datetime.getValue());
      console.log(datetime.getValue() === "");
      console.log(new Date(datetime.getValue()));

      // Crear el objeto de criterios
      const criteria: Partial<Location> = {
        location_id: 0, // Asignar valor predeterminado si no es modificable desde UI
        snapshot_id: 0, // Asignar valor predeterminado si no es modificable desde UI
        active: this.activitySearch.getSelection() as boolean, // Asegurar conversión a booleano si es necesario
        altitude: Number(altitude.getValue()) || 0, // Convertir a número y manejar valores no válidos
        latitude: Number(latitude.getValue()) || 0, // Convertir a número y manejar valores no válidos
        date_time:
          datetime.getValue() !== ""
            ? new Date(datetime.getValue())
            : undefined, // Asignar undefined si el campo está vacío
        longitude: Number(longitude.getValue()) || 0, // Convertir a número y manejar valores no válidos
        altitude_units: altitudeUnits.getValue(), // Recoger el valor tal cual
        china_coordinate_id: chinaId.getValue()
          ? Number(chinaId.getValue())
          : null, // Convertir a número o asignar null si está vacío
      };

      // Actualizar la búsqueda en la tabla
      this.table.lastSearch.criteria = criteria;
      this.refreshTable();
      this.searchModal.show(false); // Cerrar el modal después de actualizar la tabla
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LocationView();
});
