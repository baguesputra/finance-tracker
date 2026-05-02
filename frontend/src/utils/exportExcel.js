import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data, fileName = "transactions") => {
  // 🔥 mapping biar rapi & konsisten
  const formatted = data.map((item) => ({
    Tanggal: item.date,
    Tipe: item.type === "income" ? "Pemasukan" : "Pengeluaran",
    Kategori: item.category,
    Deskripsi: item.description || "-",
    Jumlah: item.amount
  }));

  const worksheet = XLSX.utils.json_to_sheet(formatted);

  // auto width kolom
  const colWidths = Object.keys(formatted[0] || {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...formatted.map((row) => String(row[key] ?? "").length)
    )
  }));
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array"
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
  });

  saveAs(blob, `${fileName}.xlsx`);
};