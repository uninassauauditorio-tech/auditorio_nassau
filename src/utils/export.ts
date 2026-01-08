import * as XLSX from 'xlsx';

export const exportToCSV = (data: any[], headers: string[], filename: string) => {
    const csvContent = "\uFEFF" // BOM for Excel encoding
        + headers.join(",") + "\n"
        + data.map(row => {
            return row.map((cell: any) => {
                if (cell === null || cell === undefined) return '""';
                const stringCell = String(cell);
                // Escape quotes and wrap in quotes
                return `"${stringCell.replace(/"/g, '""')}"`;
            }).join(",");
        }).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToXLSX = (data: any[], headers: string[], filename: string) => {
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscritos");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};
