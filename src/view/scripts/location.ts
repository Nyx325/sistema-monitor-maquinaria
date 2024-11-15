import { LocationWithSnapshot } from "../../model/entities/ModelsWithSnapshot.js";
import { View } from "./view.js";

class LocationView extends View<LocationWithSnapshot> {
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
}

document.addEventListener("DOMContentLoaded", () => {
  new LocationView();
});
