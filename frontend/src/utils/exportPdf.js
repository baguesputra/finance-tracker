import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (data, summary = {}) => {
  const doc = new jsPDF();

  // 🔥 Header
  doc.setFontSize(16);
  doc.text("Laporan Keuangan", 14, 15);

  doc.setFontSize(10);
  doc.text(`Total Income: Rp ${Number(summary.total_income || 0).toLocaleString()}`, 14, 22);
  doc.text(`Total Expense: Rp ${Number(summary.total_expense || 0).toLocaleString()}`, 14, 27);
  doc.text(`Balance: Rp ${Number(summary.balance || 0).toLocaleString()}`, 14, 32);

  // 🔥 Table
  const rows = data.map((item) => [
    item.date,
    item.type === "income" ? "Income" : "Expense",
    item.category,
    item.description || "-",
    `Rp ${Number(item.amount).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 38,
    head: [["Tanggal", "Tipe", "Kategori", "Deskripsi", "Jumlah"]],
    body: rows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] }
  });

  doc.save("finance-report.pdf");
};