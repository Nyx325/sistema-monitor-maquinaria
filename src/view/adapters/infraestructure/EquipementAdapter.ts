import Utils from "../../scripts/config.js";
import { IEquipementAdapter } from "../use_cases/IEquipementAdapter.js";

export default class EquipementAdapter implements IEquipementAdapter {
  private utils: Utils = Utils.instance;

  async add(model: {
    serial_number: string;
    active: boolean;
    oem_name: string;
    model: string;
  }): Promise<Response> {
    return await fetch(`${this.utils.apiUrl}/equipos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    });
  }

  async delete(model: {
    serial_number: string;
    active: boolean;
    oem_name: string;
    model: string;
  }): Promise<Response> {
    return await fetch(`${this.utils.apiUrl}/equipos/${model.serial_number}`, {
      method: "DELETE",
    });
  }

  async update(model: {
    serial_number: string;
    active: boolean;
    oem_name: string;
    model: string;
  }): Promise<Response> {
    return await fetch(`${this.utils.apiUrl}/equipos`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(model),
    });
  }

  async get(id: string): Promise<Response> {
    return await fetch(`${this.utils.apiUrl}/equipos/${id}`);
  }

  async getBy(
    criteria: Partial<{
      serial_number: string;
      active: boolean;
      oem_name: string;
      model: string;
    }>,
    pageNumber: number,
  ): Promise<Response> {
    const params = this.utils.createParams(criteria);
    return await fetch(
      `${this.utils.apiUrl}/equipos?pageNumber=${pageNumber}&${params}`,
    );
  }
}
