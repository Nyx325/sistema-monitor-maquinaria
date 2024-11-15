import { Search } from "../../model/entities/Search.js";
import { Adapter } from "../adapters/Adapter.js";
import Activity from "../components/activity.js";
import Alert from "../components/alert.js";
import LabeledInput from "../components/labeledInput.js";
import Modal from "../components/modal.js";
import Pager from "../components/pager.js";
import { Table } from "../components/table.js";

export abstract class View<T extends Record<string, unknown>> {
  protected form: {
    alert: Alert;
    legend: HTMLLegendElement;
    adding: boolean;
    inputs: { [key: string]: LabeledInput };
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
  protected pager: Pager<T>;

  constructor(opts: {
    alert: string;
    legend: string;
    inputs: {
      key: string;
      inputOpts: {
        containerId: string;
        labelId: string;
        inputId: string;
      };
    }[];
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
    pagerContainer: string;
  }) {
    const inputs: { [key: string]: LabeledInput } = {};

    for (const opt of opts.inputs) {
      inputs[opt.key] = new LabeledInput(opt.inputOpts);
    }

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
      inputs: inputs,
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
    this.pager = new Pager({
      container: opts.pagerContainer,
      view: this,
      table: this.table,
      maxBtns: 5,
    });

    this.initialize();
  }

  protected initialize(): void {
    this.initForm();
    this.initCrudBtns();
  }

  public async refreshTable() {
    const lastS = this.table.lastSearch;

    const response = await this.adapter.getBy(
      lastS.criteria,
      lastS.currentPage,
    );

    if (response.status >= 400) {
      const e = JSON.parse(await response.text());
      console.error(e.message);
      return;
    }

    const search: Search<T> = JSON.parse(await response.text());

    this.table.lastSearch = search;
    this.table.render();
    this.pager.render();
  }

  protected async initTable(opts: { title: string; headers: string[] }) {
    this.table.setTitle(opts.title);
    this.table.setHeaders(opts.headers);
    this.table.render();
    this.refreshTable();
  }

  protected initForm(): void {
    this.form.cancelBtn.addEventListener("click", () => {
      Promise.all([
        this.form.alert.setVisible(false),
        this.modal.show(false),
        //this.form.inputs.clearFields(),
      ]).then();
    });
  }

  protected initCrudBtns(): void {
    this.crudBtns.add.addEventListener("click", () => {
      this.clearFormFields();
      this.form.legend.innerText = "Agregar registro";
      this.form.activity.setVisible(false);
      this.addBtnAction();
      this.form.adding = true;
      this.modal.show(true);
    });

    this.crudBtns.update.addEventListener("click", () => {
      this.clearFormFields();
      this.form.adding = false;
      const lastSelected = this.table.lastSelected;
      if (!lastSelected) return;
      this.form.legend.innerText = "Actualizar registro";
      this.form.activity.setVisible(true);
      this.updateBtnAction(lastSelected.record);
      this.modal.show(true);
    });

    this.crudBtns.delete.addEventListener("click", async () => {
      const lastSelected = this.table.lastSelected;
      if (!lastSelected) return;

      const id = this.getRecordId(lastSelected.record);
      const response = await this.adapter.delete(id);

      if (response.status >= 400) {
        const e = JSON.parse(await response.text());
        console.error(e.message);
      }

      this.refreshTable();
    });
  }

  protected clearFormFields(): void {
    Object.values(this.form.inputs).forEach((input) => {
      input.clear();
    });
  }

  /**
   * Hacer acciones como ocultar ciertos cuadros de texto
   * o cualquier cosa necesaria
   */
  protected abstract addBtnAction(): void;
  /**
   * Hacer acciones extra como cargar los datos del
   * registro en sus inputs o aparecer inputs
   */
  protected abstract updateBtnAction(record: T): void;
  /**
   * Obtener el id de un registro
   */
  protected abstract getRecordId(record: T): unknown;
}
