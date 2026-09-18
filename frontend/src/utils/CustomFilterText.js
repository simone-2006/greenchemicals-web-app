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

/**
 * Base class for custom AG-Grid filters with multi-select and text search capabilities
 * OPTIMIZED VERSION - Better performance with large datasets
 */
class BaseCustomFilter {
  constructor(suffix = "") {
    this.suffix = suffix;
    this.filterText = null;
    this.filterType = "contains";
    this.selectedOptions = new Set();
    this.allOptions = new Set();
    this.isComputedColumn = false;
    this.BLANK_VALUE = "(Blanks)";
    this.lastSelectAllWasIndeterminate = false;
    this.appliedFilterText = null;
    this.appliedFilterType = "contains";
    this.appliedSelectedOptions = new Set();

    // Bind methods that are used as event handlers
    this.refreshOptionsBound = this.refreshOptions.bind(this);
    this.handleFilterTypeChange = this.handleFilterTypeChange.bind(this);
    this.handleFilterInputChange = this.handleFilterInputChange.bind(this);
    this.handleOptionsSearch = this.handleOptionsSearch.bind(this);
    this.handleSelectAllChange = this.handleSelectAllChange.bind(this);
    this.handleOptionsListClick = this.handleOptionsListClick.bind(this);
    this.handleOptionsSearchKeydown =
      this.handleOptionsSearchKeydown.bind(this);
    this.handleGuiKeydown = this.handleGuiKeydown.bind(this);
    this.handleApplyClick = this.handleApplyClick.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
  }

  /**
   * Encode option for safe storage in data-* attribute
   */
  encodeOption(option) {
    return encodeURIComponent(option);
  }

  /**
   * Decode option from data-* attribute
   */
  decodeOption(encoded) {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return encoded;
    }
  }

  /**
   * Initialize the filter component
   * @param {Object} params - AG-Grid filter params
   */
  init(params) {
    this.params = params;
    this.setupGui();
    this.extractOptionsFromData();

    // Initially select all options
    this.selectedOptions = new Set(this.allOptions);
    this.renderOptions();
    this.syncAppliedState();
    this.updateApplyButtonState();

    // Register event listeners for data changes
    this.registerEventListeners();
  }

  /**
   * Create the filter GUI
   */
  setupGui() {
    this.gui = document.createElement("div");
    this.gui.className = FILTER_PANEL_CLASS;

    this.gui.innerHTML = /*HTML */ `
      <div class="mb-4 hidden">
        <label class="block mb-2 text-xs font-semibold leading-4 text-text">Text Search</label>
        <input 
          type="text" 
          id="filterInput" 
          placeholder="Search..." 
          class="${FILTER_FIELD_CLASS}" 
          autocomplete="off"
        />
        <select 
          id="filterType" 
          class="${FILTER_FIELD_CLASS} mt-2"
        >
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
        </select>
      </div>

      <div class="space-y-3">
        <div>
          <label class="mb-2 block text-xs font-semibold leading-4 text-text">Filter</label>
          <input 
            type="text" 
            id="optionsSearch" 
            autocomplete="off"
            placeholder="Search and press Enter to select..." 
            class="${FILTER_FIELD_CLASS}" 
          />
        </div>

        <div class="rounded-md border border-border bg-background p-3">
          <label class="flex items-center gap-3 cursor-pointer font-semibold text-text">
            <input 
              type="checkbox" 
              id="selectAllCheckbox" 
              class="size-4 shrink-0 accent-brand" 
              checked 
            />
            <span>Select All</span>
          </label>
        </div>

        <ul 
          id="optionsList" 
          class="max-h-56 overflow-y-auto rounded-md border border-border bg-background-element p-1"
        ></ul>

        <div class="flex gap-2">
          <button 
            id="applyBtn" 
            class="${FILTER_PRIMARY_BTN_CLASS}"
          >OK</button>
          <button 
            id="resetBtn" 
            class="${FILTER_GHOST_BTN_CLASS}" 
            title="Reset filter"
          >
            Reset
          </button>
        </div>
      </div>
    `;

    // Get references to DOM elements
    this.eFilterType = this.gui.querySelector("#filterType");
    this.eFilterInput = this.gui.querySelector("#filterInput");
    this.eOptionsSearch = this.gui.querySelector("#optionsSearch");
    this.eOptionsList = this.gui.querySelector("#optionsList");
    this.eSelectAllCheckbox = this.gui.querySelector("#selectAllCheckbox");
    this.eApplyBtn = this.gui.querySelector("#applyBtn");
    this.eResetBtn = this.gui.querySelector("#resetBtn");

    // Attach event listeners
    this.eFilterType.addEventListener("change", this.handleFilterTypeChange);
    this.eFilterInput.addEventListener("input", this.handleFilterInputChange);
    this.eOptionsSearch.addEventListener("input", this.handleOptionsSearch);
    this.eOptionsSearch.addEventListener(
      "keydown",
      this.handleOptionsSearchKeydown,
    );
    this.eSelectAllCheckbox.addEventListener(
      "change",
      this.handleSelectAllChange,
    );

    // Use event delegation for checkbox clicks - MUCH faster!
    this.eOptionsList.addEventListener("click", this.handleOptionsListClick);

    // OK / Reset buttons
    this.eApplyBtn.addEventListener("click", this.handleApplyClick);
    this.eResetBtn.addEventListener("click", this.handleResetClick);

    // Enter key on the whole filter panel
    this.gui.setAttribute("tabindex", "-1");
    this.gui.addEventListener("keydown", this.handleGuiKeydown);
  }

  /**
   * Handle clicks on the options list using event delegation
   * This is MUCH faster than attaching individual listeners to each checkbox
   */
  handleOptionsListClick(e) {
    const checkbox = e.target.closest('input[type="checkbox"]');
    if (!checkbox) return;

    // Don't process if checkbox is disabled
    if (checkbox.disabled) return;

    const rawValue = this.decodeOption(
      checkbox.dataset.option ?? checkbox.value,
    );

    if (checkbox.checked) {
      this.selectedOptions.add(rawValue);
    } else {
      this.selectedOptions.delete(rawValue);
    }

    // Debounce the UI updates
    this.scheduleUIUpdate();
  }

  /**
   * Schedule UI update with debouncing for better performance
   */
  scheduleUIUpdate() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.syncSelectAllCheckbox();
      this.updateApplyButtonState();
      this.updateTimeout = null;
    }, 50); // 50ms debounce
  }

  /**
   * Register AG-Grid event listeners
   */
  registerEventListeners() {
    if (!this.params?.api) return;

    const events = [
      "rowDataUpdated",
      "cellValueChanged",
      "rowDataChanged",
      "filterChanged",
    ];

    events.forEach((evt) => {
      this.params.api.addEventListener(evt, this.refreshOptionsBound);
    });
  }

  /**
   * Handle filter type dropdown change
   */
  handleFilterTypeChange() {
    this.filterType = this.eFilterType.value;
    this.updateApplyButtonState();
  }

  /**
   * Handle text filter input change
   */
  handleFilterInputChange() {
    this.filterText = this.eFilterInput.value;
    this.updateApplyButtonState();
  }

  /**
   * Handle options search input
   */
  handleOptionsSearch() {
    this.filterOptionsDisplay();
  }

  /**
   * Handle Enter key on options search input (keeps backward compat)
   */
  handleOptionsSearchKeydown(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    this.applyCurrentSelection();
  }

  /**
   * Handle Enter key anywhere on the filter panel
   */
  handleGuiKeydown(e) {
    if (e.key !== "Enter") return;
    // Skip if already handled by the search input
    if (e.target === this.eOptionsSearch) return;
    e.preventDefault();
    this.applyCurrentSelection();
  }

  /**
   * Handle OK button click
   */
  handleApplyClick() {
    this.applyCurrentSelection();
  }

  /**
   * Handle Reset button click - reset filter to select all
   */
  handleResetClick() {
    this.eOptionsSearch.value = "";
    this.filterOptionsDisplay();
    this.filterText = null;
    if (this.eFilterInput) this.eFilterInput.value = "";
    this.filterType = "contains";
    if (this.eFilterType) this.eFilterType.value = "contains";
    this.selectedOptions = new Set(this.allOptions);
    this.updateCheckboxes();
    this.syncAppliedState();
    this.updateApplyButtonState();
    this.params.filterChangedCallback();
    this.closeFilterPopup();
  }

  /**
   * Apply the current checkbox selection:
   * keep only the checked visible options, deselect everything else.
   * Then clear the search input.
   */
  applyCurrentSelection() {
    // Collect currently checked visible options
    const checkedVisible = new Set();
    this.eOptionsList.querySelectorAll("li").forEach((li) => {
      if (li.classList.contains("no-match-msg")) return;
      if (li.style.display === "none") return;
      const checkbox = li.querySelector("input[type='checkbox']");
      if (checkbox && !checkbox.disabled && checkbox.checked) {
        checkedVisible.add(
          this.decodeOption(checkbox.dataset.option ?? checkbox.value),
        );
      }
    });

    if (checkedVisible.size === 0) return;

    this.selectedOptions = checkedVisible;

    // Clear search and show all options
    // this.eOptionsSearch.value = "";
    // this.filterOptionsDisplay();

    this.updateCheckboxes();
    this.syncAppliedState();
    this.updateApplyButtonState();
    this.params.filterChangedCallback();
    this.closeFilterPopup();
  }

  hasPendingChanges() {
    if ((this.filterText || "") !== (this.appliedFilterText || "")) {
      return true;
    }

    if (this.filterType !== this.appliedFilterType) {
      return true;
    }

    if (this.selectedOptions.size !== this.appliedSelectedOptions.size) {
      return true;
    }

    for (const opt of this.selectedOptions) {
      if (!this.appliedSelectedOptions.has(opt)) {
        return true;
      }
    }

    return false;
  }

  syncAppliedState() {
    this.appliedFilterText = this.filterText;
    this.appliedFilterType = this.filterType;
    this.appliedSelectedOptions = new Set(this.selectedOptions);
  }

  updateApplyButtonState() {
    if (!this.eApplyBtn) return;
    this.eApplyBtn.disabled = false;
    this.eApplyBtn.classList.add("cursor-pointer");
  }

  /**
   * Handle select all checkbox change
   */
  handleSelectAllChange() {
    // Select All SEMPRE lavora su TUTTE le opzioni, non solo quelle visibili dalla ricerca
    if (this.lastSelectAllWasIndeterminate) {
      // Se era indeterminate, seleziona tutte
      this.selectedOptions = new Set(this.allOptions);
    } else if (
      this.selectedOptions.size === this.allOptions.size &&
      this.allOptions.size > 0
    ) {
      // Tutte le opzioni sono selezionate -> deseleziona TUTTE
      this.selectedOptions.clear();
    } else {
      // Non tutte le opzioni sono selezionate -> seleziona TUTTE
      this.selectedOptions = new Set(this.allOptions);
    }

    this.updateCheckboxes();
    this.updateApplyButtonState();
  }

  /**
   * Extract unique values from the grid data
   */
  extractOptionsFromData() {
    const uniqueValues = new Set();

    if (!this.params?.api) {
      this.allOptions = uniqueValues;
      return;
    }

    const colDef = this.params.column.getColDef();
    this.isComputedColumn = !!colDef.valueGetter;

    this.params.api.forEachNode((node) => {
      if (!node.data) return;
      if (!this.nodePassesOtherFilters(node)) return;

      const value = this.getValueFromNode(node, colDef);

      if (this.isBlankValue(value)) {
        uniqueValues.add(this.BLANK_VALUE);
      } else {
        uniqueValues.add(String(value).trim());
      }
    });

    this.allOptions = uniqueValues;
  }

  /**
   * Check if a node passes all filters EXCEPT the current column's filter
   */
  nodePassesOtherFilters(node) {
    if (!node) {
      return true;
    }

    if (typeof this.params?.doesRowPassOtherFilter === "function") {
      try {
        return this.params.doesRowPassOtherFilter(node);
      } catch {
        // Fallback to manual evaluation below
      }
    }

    if (!this.params?.api || !node.data) {
      return true;
    }

    const currentColumnId = this.params.column.getColId();
    let passesOtherFilters = true;

    const columnDefs = this.params.api.getColumnDefs?.() || [];

    columnDefs.forEach((colDef) => {
      if (!colDef.field) return;

      const columnId = colDef.field;
      if (columnId === currentColumnId) return;

      const filterModel = this.params.api.getFilterModel();
      if (!filterModel || !filterModel[columnId]) return;

      const filterData = filterModel[columnId];
      const cellValue = node.data[columnId];

      if (filterData.selectedOptions) {
        const valueToCheck = this.isBlankValue(cellValue)
          ? this.BLANK_VALUE
          : String(cellValue).trim();

        if (!filterData.selectedOptions.includes(valueToCheck)) {
          passesOtherFilters = false;
        }
      }
    });

    return passesOtherFilters;
  }

  /**
   * Check if a value should be treated as blank
   */
  isBlankValue(value) {
    return (
      value === null ||
      value === undefined ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    );
  }

  /**
   * Render the options list in the UI
   * OPTIMIZED: Uses DocumentFragment for better performance
   */
  renderOptions() {
    const sortedOptions = this.getSortedOptions();

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    sortedOptions.forEach((option) => {
      const li = this.createOptionElement(option);
      fragment.appendChild(li);
    });

    // Clear and append in one operation
    this.eOptionsList.innerHTML = "";
    this.eOptionsList.appendChild(fragment);
  }

  /**
   * Get sorted options array
   */
  getSortedOptions() {
    return Array.from(this.allOptions).sort((a, b) => {
      if (a === this.BLANK_VALUE) return 1;
      if (b === this.BLANK_VALUE) return -1;

      return a.localeCompare(b, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }

  /**
   * Create DOM element for a single option
   * OPTIMIZED: Creates actual DOM elements instead of innerHTML
   */
  createOptionElement(option) {
    const li = document.createElement("li");
    li.className = FILTER_OPTION_CLASS;

    const label = document.createElement("label");
    label.className =
      "flex items-center gap-2 cursor-pointer select-none text-sm";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "size-4 shrink-0 cursor-pointer accent-brand";
    checkbox.value = this.escapeHtml(option);
    checkbox.dataset.option = this.encodeOption(option);
    checkbox.checked = this.selectedOptions.has(option);

    const span = document.createElement("span");
    span.style.fontSize = "0.9em";
    span.textContent = this.getDisplayText(option);

    label.appendChild(checkbox);
    label.appendChild(span);
    li.appendChild(label);

    return li;
  }

  /**
   * Get display text for an option
   */
  getDisplayText(option) {
    if (option === this.BLANK_VALUE || this.isComputedColumn) {
      return option;
    }
    return this.suffix ? `${option} ${this.suffix}`.trim() : option;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Sync the "Select All" checkbox state
   * Mostra lo stato di TUTTE le opzioni, non solo quelle visibili
   */
  syncSelectAllCheckbox() {
    this.lastSelectAllWasIndeterminate = this.eSelectAllCheckbox.indeterminate;

    // Conta su TUTTE le opzioni, non solo quelle visibili
    const totalOptions = this.allOptions.size;
    const totalSelected = this.selectedOptions.size;

    if (totalOptions === 0) {
      this.eSelectAllCheckbox.checked = false;
      this.eSelectAllCheckbox.indeterminate = false;
      this.eSelectAllCheckbox.disabled = true;
      return;
    }

    this.eSelectAllCheckbox.disabled = false;

    if (totalSelected === 0) {
      this.eSelectAllCheckbox.checked = false;
      this.eSelectAllCheckbox.indeterminate = false;
    } else if (totalSelected === totalOptions) {
      this.eSelectAllCheckbox.checked = true;
      this.eSelectAllCheckbox.indeterminate = false;
    } else {
      this.eSelectAllCheckbox.checked = false;
      this.eSelectAllCheckbox.indeterminate = true;
    }
  }

  /**
   * Get currently visible options (after search filter)
   * OPTIMIZED: Caches search value
   */
  getVisibleOptions() {
    const visible = new Set();
    const searchValue = this.eOptionsSearch.value.toLowerCase().trim();

    if (searchValue === "") {
      return new Set(this.allOptions);
    }

    this.eOptionsList.querySelectorAll("li").forEach((li) => {
      if (li.style.display !== "none") {
        const checkbox = li.querySelector("input[type='checkbox']");
        if (checkbox && !checkbox.disabled) {
          const rawValue = this.decodeOption(
            checkbox.dataset.option ?? checkbox.value,
          );
          visible.add(rawValue);
        }
      }
    });

    return visible;
  }

  /**
   * Update all checkboxes to match current selection
   * OPTIMIZED: Only updates if value changed
   */
  updateCheckboxes() {
    const checkboxes = this.eOptionsList.querySelectorAll(
      "input[type='checkbox']",
    );

    checkboxes.forEach((cb) => {
      const rawValue = this.decodeOption(cb.dataset.option ?? cb.value);
      const shouldBeChecked = this.selectedOptions.has(rawValue);

      if (cb.checked !== shouldBeChecked) {
        cb.checked = shouldBeChecked;
      }
    });

    this.syncSelectAllCheckbox();
  }

  /**
   * Filter the options display based on search input
   * OPTIMIZED: Uses requestAnimationFrame for smoother updates
   */
  filterOptionsDisplay() {
    const searchValue = this.eOptionsSearch.value.toLowerCase().trim();
    const listItems = this.eOptionsList.querySelectorAll("li");

    // Remove previous "No match" message if present
    const existingNoMatch = this.eOptionsList.querySelector(".no-match-msg");
    if (existingNoMatch) existingNoMatch.remove();

    // Use requestAnimationFrame for smoother updates with large lists
    requestAnimationFrame(() => {
      let visibleCount = 0;

      listItems.forEach((li) => {
        if (li.classList.contains("no-match-msg")) return;
        const text = li.textContent.toLowerCase();
        const checkbox = li.querySelector("input[type='checkbox']");
        const isVisible = text.includes(searchValue);

        li.style.display = isVisible ? "" : "none";

        if (checkbox) {
          checkbox.disabled = !isVisible;
        }

        if (isVisible) visibleCount++;
      });

      // Show "No match" if no visible options and search is active
      const oldMsg = this.eOptionsList.querySelector(".no-match-msg");
      if (oldMsg) oldMsg.remove();

      if (visibleCount === 0 && searchValue !== "") {
        const noMatchLi = document.createElement("li");
        noMatchLi.className = "no-match-msg px-2 py-2.5 text-center text-xs italic text-muted";
        noMatchLi.textContent = "No match";
        this.eOptionsList.appendChild(noMatchLi);
      }

      this.syncSelectAllCheckbox();
    });
  }

  /**
   * Check if a row passes this filter
   */
  doesFilterPass(params) {
    const { node } = params;

    if (node && node.data && node.data.__forceVisibleUnderFilter === true) {
      return true;
    }

    const value = this.getValueFromNode(node, this.params.column.getColDef());

    const cellValue = this.isBlankValue(value)
      ? this.BLANK_VALUE
      : String(value).trim();

    if (!this.selectedOptions.has(cellValue)) {
      return false;
    }

    if (this.isTextFilterActive() && cellValue !== this.BLANK_VALUE) {
      return this.passesTextFilter(cellValue);
    }

    return true;
  }

  /**
   * Check if text filter is active
   */
  isTextFilterActive() {
    return this.filterText !== null && this.filterText.trim() !== "";
  }

  /**
   * Check if a value passes the text filter
   */
  passesTextFilter(cellValue) {
    const search = this.filterText.toLowerCase();
    const value = cellValue.toLowerCase();

    switch (this.filterType) {
      case "equals":
        return value === search;
      case "startsWith":
        return value.startsWith(search);
      case "endsWith":
        return value.endsWith(search);
      case "contains":
      default:
        return value.includes(search);
    }
  }

  /**
   * Check if the filter is currently active
   */
  isFilterActive() {
    return (
      this.isTextFilterActive() ||
      this.selectedOptions.size < this.allOptions.size
    );
  }

  /**
   * Refresh options when data changes
   * OPTIMIZED: Only re-renders if necessary
   */
  refreshOptions() {
    const previousAllOptions = new Set(this.allOptions);
    const wasSelectAll = this.selectedOptions.size === this.allOptions.size;

    this.extractOptionsFromData();

    // Check if options actually changed
    const optionsChanged =
      this.allOptions.size !== previousAllOptions.size ||
      Array.from(this.allOptions).some((opt) => !previousAllOptions.has(opt));

    if (!optionsChanged) {
      return; // No need to re-render
    }

    const newValues = new Set();
    this.allOptions.forEach((option) => {
      if (!previousAllOptions.has(option)) {
        newValues.add(option);
      }
    });

    if (wasSelectAll) {
      this.selectedOptions = new Set(this.allOptions);
    } else {
      const updatedSelection = new Set();

      this.selectedOptions.forEach((opt) => {
        if (this.allOptions.has(opt)) {
          updatedSelection.add(opt);
        }
      });

      newValues.forEach((opt) => updatedSelection.add(opt));

      this.selectedOptions = updatedSelection;
    }

    if (this.eOptionsList) {
      this.renderOptions();
      this.filterOptionsDisplay();
      this.updateApplyButtonState();
    }
  }

  /**
   * Get the current filter model
   */
  getModel() {
    if (!this.isFilterActive()) {
      return null;
    }

    return {
      filterText: this.filterText,
      filterType: this.filterType,
      selectedOptions: Array.from(this.selectedOptions),
    };
  }

  /**
   * Set the filter model
   */
  setModel(model) {
    if (model) {
      this.filterText = model.filterText || null;
      this.filterType = model.filterType || "contains";
      this.selectedOptions = new Set(model.selectedOptions || []);
    } else {
      this.filterText = null;
      this.filterType = "contains";
      this.selectedOptions = new Set(this.allOptions);
    }

    this.updateUI();
    this.syncAppliedState();
    this.updateApplyButtonState();
  }

  /**
   * Update the UI to match current state
   */
  updateUI() {
    if (this.eFilterInput) {
      this.eFilterInput.value = this.filterText || "";
    }
    if (this.eFilterType) {
      this.eFilterType.value = this.filterType;
    }
    this.updateCheckboxes();
  }

  /**
   * Get the filter GUI element
   */
  getGui() {
    return this.gui;
  }

  /**
   * AG-Grid calls this when the filter popup is shown.
   * Capture the hidePopup callback so we can close the popup programmatically.
   */
  afterGuiAttached(params) {
    this.hidePopup = params?.hidePopup || null;
    if (this.eOptionsSearch) {
      this.eOptionsSearch.focus();
    }
  }

  /**
   * Close the filter popup if possible
   */
  closeFilterPopup() {
    if (typeof this.hidePopup === "function") {
      this.hidePopup();
    }
  }

  /**
   * Extract value from a node using various methods
   */
  getValueFromNode(node, colDef) {
    if (this.params?.valueGetter) {
      return this.params.valueGetter({ node });
    }

    if (colDef.field && node.data) {
      return node.data[colDef.field];
    }

    if (colDef.valueGetter && typeof colDef.valueGetter === "function") {
      return colDef.valueGetter({
        data: node.data,
        node,
        colDef,
        api: this.params.api,
        column: this.params.column,
        context: this.params.context,
        getValue: (colId) =>
          this.params.api?.getCellValue({ rowNode: node, column: colId }),
      });
    }

    return null;
  }

  /**
   * Cleanup when filter is destroyed
   */
  destroy() {
    // Clear any pending timeouts
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    if (this.params?.api) {
      const events = [
        "rowDataUpdated",
        "cellValueChanged",
        "rowDataChanged",
        "filterChanged",
      ];

      events.forEach((evt) => {
        this.params.api.removeEventListener(evt, this.refreshOptionsBound);
      });
    }

    // Remove event delegation listener
    if (this.eOptionsList) {
      this.eOptionsList.removeEventListener(
        "click",
        this.handleOptionsListClick,
      );
    }

    if (this.eOptionsSearch) {
      this.eOptionsSearch.removeEventListener(
        "keydown",
        this.handleOptionsSearchKeydown,
      );
    }

    if (this.eApplyBtn) {
      this.eApplyBtn.removeEventListener("click", this.handleApplyClick);
    }
    if (this.eResetBtn) {
      this.eResetBtn.removeEventListener("click", this.handleResetClick);
    }
    if (this.gui) {
      this.gui.removeEventListener("keydown", this.handleGuiKeydown);
    }

    // Clean up DOM references
    this.gui = null;
    this.eFilterType = null;
    this.eFilterInput = null;
    this.eOptionsSearch = null;
    this.eOptionsList = null;
    this.eSelectAllCheckbox = null;
    this.eApplyBtn = null;
    this.eResetBtn = null;
  }
}

/**
 * Text filter without suffix
 */
export class CustomFilterText extends BaseCustomFilter {
  constructor() {
    super("");
  }
}

export default CustomFilterText;
export { BaseCustomFilter };
