import {
  BUTTON_COMMON_CLASSES,
  FIELD_COMMON_CLASSES,
  FIELD_VARIANT_CLASSES,
} from "@/components/ui/fieldStyles";

const FILTER_FIELD_CLASS = `${FIELD_COMMON_CLASSES} ${FIELD_VARIANT_CLASSES.default} h-8 py-1 max-w-none`;
const FILTER_PRIMARY_BTN_CLASS = `${BUTTON_COMMON_CLASSES} ${FIELD_VARIANT_CLASSES.superPrimary} flex-1 justify-center`;
const FILTER_GHOST_BTN_CLASS = `${BUTTON_COMMON_CLASSES} ${FIELD_VARIANT_CLASSES.ghost} flex-1 justify-center`;
const FILTER_PANEL_CLASS =
  "p-4 min-w-[260px] max-w-[340px] rounded-md border border-border bg-background-element text-text";
const FILTER_OPTION_CLASS =
  "px-2 py-1 border-b border-border hover:bg-background-secondary/60";

function nodePassesOtherFilters(params, node) {
  if (!params || typeof params.doesRowPassOtherFilter !== "function") {
    return true;
  }
  return params.doesRowPassOtherFilter(node);
}

class CustomFilterDate {
  constructor() {
    this.BLANK_VALUE = "(Blank)";

    this.dateFrom = null;
    this.dateTo = null;
    this.appliedDateFrom = null;
    this.appliedDateTo = null;

    this.allOptions = new Set();
    this.selectedOptions = new Set();
    this.appliedSelectedOptions = new Set();

    this.isComputedColumn = false;
  }

  // ─────────────────────────────────────────────
  //  INIT
  // ─────────────────────────────────────────────

  init(params) {
    this.params = params;
    this._buildGui();
    this._refresh();
    this._syncAppliedState();
    this._updateApplyButtonState();

    this._boundRefresh = this._refresh.bind(this);
    if (params.api) {
      [
        "rowDataUpdated",
        "cellValueChanged",
        "rowDataChanged",
        "filterChanged",
      ].forEach((evt) => params.api.addEventListener(evt, this._boundRefresh));
    }
  }

  // ─────────────────────────────────────────────
  //  GUI
  // ─────────────────────────────────────────────

  _buildGui() {
    this.gui = document.createElement("div");
    this.gui.className = FILTER_PANEL_CLASS;

    this.gui.innerHTML = /*html*/ `
      <div class="space-y-4">
        <div class="space-y-3 rounded-md border border-border bg-background p-4">
          <div class="flex items-center justify-between text-xs font-semibold leading-4 text-text">
            <span>Date range</span>
          </div>
          <div class="grid gap-3">
            <label class="grid gap-1 text-xs">
              <span class="font-semibold text-text">From</span>
              <input type="date" id="df-from" class="${FILTER_FIELD_CLASS}" />
            </label>
            <label class="grid gap-1 text-xs">
              <span class="font-semibold text-text">To</span>
              <input type="date" id="df-to" class="${FILTER_FIELD_CLASS}" />
            </label>
          </div>
          <button id="df-clear-range" class="${FILTER_GHOST_BTN_CLASS} mt-2 w-full">
            Clear dates
          </button>
        </div>

        <div class="space-y-3 rounded-md border border-border bg-background-element p-4">
          <div class="flex items-center justify-between text-xs font-semibold leading-4 text-text">
            <span>Values</span>
            <span id="df-count" class="text-xs text-muted"></span>
          </div>
          <input type="text" id="df-search" placeholder="Search..." class="${FILTER_FIELD_CLASS}" />
          <label class="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-3 text-xs font-semibold text-text">
            <input type="checkbox" id="df-select-all" class="size-4 shrink-0 accent-brand" checked />
            <span>Select all</span>
          </label>
          <ul id="df-list" class="max-h-56 overflow-y-auto rounded-md border border-border bg-background p-2"></ul>
        </div>

        <div class="flex gap-2">
          <button id="applyBtn" class="${FILTER_PRIMARY_BTN_CLASS}">OK</button>
          <button id="resetBtn" class="${FILTER_GHOST_BTN_CLASS}" title="Reset filter">
            Reset
          </button>
        </div>
      </div>
    `;

    // ── Element refs ──
    this._eFrom = this.gui.querySelector("#df-from");
    this._eTo = this.gui.querySelector("#df-to");
    this._eClearRange = this.gui.querySelector("#df-clear-range");

    this._eSearch = this.gui.querySelector("#df-search");
    this._eSelectAll = this.gui.querySelector("#df-select-all");
    this._eList = this.gui.querySelector("#df-list");
    this._eCount = this.gui.querySelector("#df-count");

    this._eApplyBtn = this.gui.querySelector("#applyBtn");
    this._eResetBtn = this.gui.querySelector("#resetBtn");

    // ── Events ──
    this._eFrom.addEventListener("change", () => {
      this.dateFrom = this._eFrom.value || null;
      this._updateApplyButtonState();
    });
    this._eTo.addEventListener("change", () => {
      this.dateTo = this._eTo.value || null;
      this._updateApplyButtonState();
    });
    this._eClearRange.addEventListener("click", () => {
      this.dateFrom = null;
      this.dateTo = null;
      this._eFrom.value = "";
      this._eTo.value = "";
      this._updateApplyButtonState();
    });

    this._eSearch.addEventListener("input", () => this._filterListDisplay());

    this._eSelectAll.addEventListener("change", (e) => {
      if (e.target.checked) {
        this.selectedOptions = new Set(this.allOptions);
      } else {
        this.selectedOptions.clear();
      }
      this._renderList();
      this._updateApplyButtonState();
    });

    this._eApplyBtn.addEventListener("click", () => {
      this._applyPendingFilters();
    });

    this._eResetBtn.addEventListener("click", () => {
      this._fullReset();
      this._updateApplyButtonState();
    });
  }

  // ─────────────────────────────────────────────
  //  DATA EXTRACTION
  // ─────────────────────────────────────────────

  _getValueFromNode(node) {
    const colDef = this.params.column.getColDef();
    let value;

    if (colDef.valueGetter) {
      value = colDef.valueGetter({
        data: node.data,
        node,
        colDef,
        api: this.params.api,
        column: this.params.column,
        context: this.params.context,
        getValue: (colId) => (node.data && colId ? node.data[colId] : null),
      });
    } else if (colDef.field && node.data) {
      value = node.data[colDef.field];
    } else if (
      this.params.api &&
      typeof this.params.api.getCellValue === "function"
    ) {
      try {
        value = this.params.api.getCellValue({
          rowNode: node,
          column: this.params.column,
        });
      } catch {
        value = null;
      }
    }
    return value;
  }

  _parseDate(value) {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    if (typeof value === "string") {
      const t = value.trim();
      // gg/mm/aaaa
      const it = t.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
      if (it) {
        const d = new Date(+it[3], +it[2] - 1, +it[1]);
        return isNaN(d.getTime()) ? null : d;
      }
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  _formatForDisplay(value) {
    const d = this._parseDate(value);
    if (!d) return this.BLANK_VALUE;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}/${d.getFullYear()}`;
  }

  _parseDisplayDate(str) {
    if (!str || str === this.BLANK_VALUE) return null;
    const p = str.split("/");
    if (p.length !== 3) return null;
    return new Date(+p[2], +p[1] - 1, +p[0]);
  }

  _extractOptions() {
    const unique = new Set();
    if (!this.params?.api) {
      this.allOptions = unique;
      return;
    }

    const colDef = this.params.column.getColDef();
    this.isComputedColumn = !!colDef.valueGetter;

    this.params.api.forEachNode((node) => {
      if (!nodePassesOtherFilters(this.params, node)) return;

      const raw = this._getValueFromNode(node);
      const disp = this._formatForDisplay(raw);
      unique.add(disp);
    });

    this.allOptions = unique;
  }

  // ─────────────────────────────────────────────
  //  CHECKBOX LIST
  // ─────────────────────────────────────────────

  _renderList() {
    const sorted = Array.from(this.allOptions).sort((a, b) => {
      if (a === this.BLANK_VALUE) return 1;
      if (b === this.BLANK_VALUE) return -1;
      const da = this._parseDisplayDate(a);
      const db = this._parseDisplayDate(b);
      if (!da) return 1;
      if (!db) return -1;
      return db - da;
    });

    this._eList.innerHTML = sorted
      .map(
        (opt) => /*html*/ `
        <li class="${FILTER_OPTION_CLASS}">
          <label>
            <input type="checkbox" value="${opt}" class="size-4 shrink-0 accent-brand" ${this.selectedOptions.has(opt) ? "checked" : ""} />
            <span>${opt}</span>
          </label>
        </li>`,
      )
      .join("");

    this._eList.querySelectorAll("input[type=checkbox]").forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) {
          this.selectedOptions.add(cb.value);
        } else {
          this.selectedOptions.delete(cb.value);
        }
        this._syncSelectAll();
        this._updateApplyButtonState();
      });
    });

    this._syncSelectAll();
    this._updateCount();
    this._filterListDisplay();
  }

  _syncSelectAll() {
    const all = this.allOptions.size;
    const sel = this.selectedOptions.size;
    this._eSelectAll.checked = sel === all;
    this._eSelectAll.indeterminate = sel > 0 && sel < all;
  }

  _updateCount() {
    this._eCount.textContent = `${this.selectedOptions.size} / ${this.allOptions.size}`;
  }

  _filterListDisplay() {
    const q = this._eSearch.value.toLowerCase();
    this._eList.querySelectorAll("li").forEach((li) => {
      li.style.display = li.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  }

  // ─────────────────────────────────────────────
  //  REFRESH (rebuild all from grid data)
  // ─────────────────────────────────────────────

  _refresh() {
    const prevAll = new Set(this.allOptions);
    const pendingWasSelectAll =
      this.selectedOptions.size === this.allOptions.size ||
      this.allOptions.size === 0;
    const appliedWasSelectAll =
      this.appliedSelectedOptions.size === this.allOptions.size ||
      this.allOptions.size === 0;

    this._extractOptions();

    this.selectedOptions = this._reconcileSelection(
      this.selectedOptions,
      prevAll,
      pendingWasSelectAll,
    );
    this.appliedSelectedOptions = this._reconcileSelection(
      this.appliedSelectedOptions,
      prevAll,
      appliedWasSelectAll,
    );

    this._renderList();
    this._updateApplyButtonState();
  }

  // ─────────────────────────────────────────────
  //  FULL RESET
  // ─────────────────────────────────────────────

  _fullReset() {
    this.dateFrom = null;
    this.dateTo = null;
    this._eFrom.value = "";
    this._eTo.value = "";

    this.selectedOptions = new Set(this.allOptions);
    this._renderList();
    this._eSearch.value = "";
  }

  _reconcileSelection(selection, previousAllOptions, wasSelectAll) {
    if (wasSelectAll) {
      return new Set(this.allOptions);
    }

    const nextSelection = new Set();
    selection.forEach((opt) => {
      if (this.allOptions.has(opt)) {
        nextSelection.add(opt);
      }
    });
    this.allOptions.forEach((opt) => {
      if (!previousAllOptions.has(opt)) {
        nextSelection.add(opt);
      }
    });

    return nextSelection;
  }

  _syncAppliedState() {
    this.appliedDateFrom = this.dateFrom;
    this.appliedDateTo = this.dateTo;
    this.appliedSelectedOptions = new Set(this.selectedOptions);
  }

  _hasPendingChanges() {
    if ((this.dateFrom || "") !== (this.appliedDateFrom || "")) return true;
    if ((this.dateTo || "") !== (this.appliedDateTo || "")) return true;
    if (this.selectedOptions.size !== this.appliedSelectedOptions.size) {
      return true;
    }
    for (const opt of this.selectedOptions) {
      if (!this.appliedSelectedOptions.has(opt)) return true;
    }
    return false;
  }

  _updateApplyButtonState() {
    if (!this._eApplyBtn) return;
    this._eApplyBtn.disabled = false;
    this._eApplyBtn.style.opacity = "1";
    this._eApplyBtn.style.cursor = "pointer";
  }

  _applyPendingFilters() {
    this._syncAppliedState();
    this._updateApplyButtonState();
    this.params.filterChangedCallback();
    this._closePopup();
  }

  // ─────────────────────────────────────────────
  //  FILTER LOGIC
  // ─────────────────────────────────────────────

  isFilterActive() {
    return (
      this.appliedDateFrom !== null ||
      this.appliedDateTo !== null ||
      this.appliedSelectedOptions.size < this.allOptions.size
    );
  }

  doesFilterPass(params) {
    const { node } = params;

    // Rows marked to always be visible (e.g., totals)
    if (node?.data?.__forceVisibleUnderFilter === true) return true;

    const raw = this._getValueFromNode(node);
    const disp = this._formatForDisplay(raw);

    // 1. Checkbox list
    if (!this.appliedSelectedOptions.has(disp)) return false;

    const date = this._parseDate(raw);

    // 2. Date range
    if (
      disp !== this.BLANK_VALUE &&
      (this.appliedDateFrom || this.appliedDateTo)
    ) {
      if (!date) return false;
      if (this.appliedDateFrom) {
        const from = new Date(this.appliedDateFrom);
        from.setHours(0, 0, 0, 0);
        if (date < from) return false;
      }
      if (this.appliedDateTo) {
        const to = new Date(this.appliedDateTo);
        to.setHours(23, 59, 59, 999);
        if (date > to) return false;
      }
    }

    return true;
  }

  // ─────────────────────────────────────────────
  //  MODEL
  // ─────────────────────────────────────────────

  getModel() {
    if (!this.isFilterActive()) return null;
    return {
      filterType: "CustomFilterDate",
      dateFrom: this.appliedDateFrom,
      dateTo: this.appliedDateTo,
      selectedOptions: Array.from(this.appliedSelectedOptions),
    };
  }

  setModel(model) {
    if (model) {
      this.dateFrom = model.dateFrom || null;
      this.dateTo = model.dateTo || null;
      this.selectedOptions = new Set(model.selectedOptions || this.allOptions);
      this._syncAppliedState();
    } else {
      this.dateFrom = null;
      this.dateTo = null;
      this.selectedOptions = new Set(this.allOptions);
      this._syncAppliedState();
    }
    this._syncUi();
    this._updateApplyButtonState();
  }

  _syncUi() {
    if (this._eFrom) this._eFrom.value = this.dateFrom || "";
    if (this._eTo) this._eTo.value = this.dateTo || "";
    this._renderList();
  }

  // ─────────────────────────────────────────────
  //  MISC
  // ─────────────────────────────────────────────

  _closePopup() {
    if (typeof this.params?.hidePopup === "function") {
      this.params.hidePopup();
      return;
    }
    this.gui?.closest(".ag-popup")?.remove();
  }

  getGui() {
    return this.gui;
  }

  destroy() {
    if (this.params?.api && this._boundRefresh) {
      [
        "rowDataUpdated",
        "cellValueChanged",
        "rowDataChanged",
        "filterChanged",
      ].forEach((evt) =>
        this.params.api.removeEventListener(evt, this._boundRefresh),
      );
    }
  }
}

export default CustomFilterDate;
export { CustomFilterDate };
