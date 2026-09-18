"use client";

import { useMemo } from "react";
import { AllCommunityModule, themeQuartz } from "ag-grid-community";
import { AgGridProvider, AgGridReact } from "ag-grid-react";

import CustomFilterText from "@/utils/CustomFilterText";
import CustomFilterDate from "@/utils/CustomFilterDate";

export { CustomFilterText, CustomFilterDate };

const gridTheme = themeQuartz.withParams({
    backgroundColor: "#ffffff",
    foregroundColor: "#1e293b",
    headerBackgroundColor: "#f8fafc",
    borderColor: "#e5e7eb",
    rowHoverColor: "#f1f5f9",
    selectedRowBackgroundColor: "rgba(37, 99, 235, 0.08)",
    spacing: 8,
    fontSize: 13,
    headerFontSize: 13,
});

/**
 * Shared AG Grid table.
 * Default filter is CustomFilterText; use CustomFilterDate on date columns.
 */
export default function Table({
    columnDefs = [],
    rowData = [],
    defaultColDef: defaultColDefOverride,
    rowSelection,
    rowHeight = 40,
    pagination = false,
    localeText,
    className = "",
    style,
    ...gridProps
}) {
    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            filter: CustomFilterText,
            resizable: true,
            ...defaultColDefOverride,
        }),
        [defaultColDefOverride],
    );

    const selection = useMemo(
        () =>
            rowSelection ?? {
                mode: "singleRow",
                checkboxes: false,
                headerCheckbox: false,
                enableClickSelection: true,
            },
        [rowSelection],
    );

    return (
        <AgGridProvider modules={[AllCommunityModule]}>
            <div
                className={`h-full w-full ${className}`}
                style={{ height: "100%", minHeight: 480, ...style }}
            >
                <AgGridReact
                    theme={gridTheme}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowHeight={rowHeight}
                    pagination={pagination}
                    enableCellTextSelection
                    suppressMovableColumns
                    rowSelection={selection}
                    localeText={localeText}
                    reactiveCustomComponents={false}
                    {...gridProps}
                />
            </div>
        </AgGridProvider>
    );
}
