import { Adapter } from "../adapters/Adapter.js";
import Activity from "../components/activity.js";
import Alert from "../components/alert.js";
import Inputs from "../components/inputs.js";
import Modal from "../components/modal.js";
import { Table } from "../components/table.js";

export abstract class View<T extends Record<string, unknown>> {
  protected form: {
    alert: Alert;
    legend: HTMLLegendElement;
    adding: boolean;
    inputs: Inputs;
    activity: Activity;
    aceptBtn: HTMLButtonElement;
    cancelBtn: HTMLButtonElement;
  };

  protected crudBtns: {
    add: HTMLButtonElement;
    update: HTMLButtonElement;
    delete: HTMLButtonElement;
  };

  protected modal: Modal;
  protected table: Table<T>;
  protected adapter: Adapter;

  constructor(opts: {
    alert: string;
    legend: string;
    inputs: { key: string; id: string }[];
    activity: {
      container: string;
      true: string;
      false: string;
    };
    aceptBtn: string;
    cancelBtn: string;
    addBtn: string;
    updateBtn: string;
    deleteBtn: string;
    modalId: string;
    tableId: string;
    adapterEndpoint: string;
  }) {
    this.form = {
      alert: new Alert(opts.alert),
      legend: document.getElementById(opts.legend) as HTMLLegendElement,
      activity: new Activity({
        container: document.getElementById(
          opts.activity.container,
        ) as HTMLElement,
        falseI: document.getElementById(
          opts.activity.false,
        ) as HTMLInputElement,
        trueI: document.getElementById(opts.activity.true) as HTMLInputElement,
      }),
      inputs: new Inputs(opts.inputs),
      adding: false,
      aceptBtn: document.getElementById(opts.aceptBtn) as HTMLButtonElement,
      cancelBtn: document.getElementById(opts.cancelBtn) as HTMLButtonElement,
    };

    this.crudBtns = {
      add: document.getElementById(opts.addBtn) as HTMLButtonElement,
      update: document.getElementById(opts.updateBtn) as HTMLButtonElement,
      delete: document.getElementById(opts.deleteBtn) as HTMLButtonElement,
    };

    this.table = new Table<T>(opts.tableId);
    this.modal = new Modal(opts.modalId);
    this.adapter = new Adapter(opts.adapterEndpoint);

    this.initialize();
  }

  protected abstract initialize(): void;

  private async initTable(opts: {
    title: string;
    headers: string[];
    onParse: (record: T) => string[];
  }) {}
}
