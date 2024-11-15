import { View } from "../scripts/view.js";
import { Table } from "./table.js";
import Button from "./button.js";

export default class Pager<T extends Record<string, unknown>> {
  private view: View<T>;
  private table: Table<T>;
  private container: HTMLElement;
  private maxBtns: number;
  private btns: {
    prev: Button;
    next: Button;
    first: Button;
    last: Button;
    pages: Button[];
  };

  constructor({
    container,
    maxBtns,
    view,
    table,
  }: {
    container: string;
    maxBtns: number;
    view: View<T>;
    table: Table<T>;
  }) {
    this.container = document.getElementById(container) as HTMLElement;
    this.view = view;
    this.table = table;
    this.maxBtns = maxBtns;
    this.btns = {
      prev: new Button("←"),
      next: new Button("→"),
      first: new Button("1"),
      last: new Button(),
      pages: [],
    };

    this.initNavigationBtns();
    this.render();
  }

  private initNavigationBtns() {
    Object.values(this.btns).forEach((btn) => {
      if (btn instanceof Button) {
        btn.addClass("page-btn");
      }
    });

    this.btns.first.onClick(() => {
      this.table.lastSearch.currentPage = 1;
      this.view.refreshTable();
      this.render();
    });

    this.btns.prev.onClick(() => {
      const s = this.table.lastSearch;
      if (s.currentPage > 1) {
        s.currentPage--;
        this.view.refreshTable();
        this.render();
      }
    });

    this.btns.next.onClick(() => {
      const s = this.table.lastSearch;
      if (s.currentPage < s.totalPages) {
        s.currentPage++;
        this.view.refreshTable();
        this.render();
      }
    });

    this.btns.last.onClick(() => {
      const s = this.table.lastSearch;
      if (s.currentPage < s.totalPages) {
        s.currentPage = s.totalPages;
        this.view.refreshTable();
        this.render();
      }
    });
  }

  public render() {
    const s = this.table.lastSearch;
    if (!s) return;

    const pages = {
      total: s.totalPages,
      current: s.currentPage,
    };

    // Crear botones de páginas numéricas
    const btnsArr = this.pageNumbers(pages);

    this.btns.last.setText(s.totalPages);

    this.container.innerHTML = ""; // Limpiar contenedor
    if (s.totalPages <= 1) return;
    this.container.appendChild(this.btns.first.button);
    this.container.appendChild(this.btns.prev.button);

    // Renderizar botones de páginas numéricas
    btnsArr.forEach((pageNumber) => {
      const btn = new Button(pageNumber.toString());
      btn.addClass("page-btn");
      if (s.currentPage === pageNumber) btn.addClass("current-page");
      btn.onClick(() => {
        this.table.lastSearch.currentPage = pageNumber;
        this.view.refreshTable();
        this.render();
      });
      btn.setDisabled(pageNumber === pages.current);
      this.container.appendChild(btn.button);
    });

    this.container.appendChild(this.btns.next.button);
    this.container.appendChild(this.btns.last.button);
  }

  private pageNumbers({
    total,
    current,
  }: {
    total: number;
    current: number;
  }): number[] {
    const max = Math.min(this.maxBtns, total); // No exceder el total de páginas
    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half); // Evitar valores negativos
    let end = start + max - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - max + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
}
