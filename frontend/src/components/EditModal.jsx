import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

function EditModal({ isOpen, onClose, data, refresh }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: ''
  });

  const [loading, setLoading] = useState(false);

  // 🔥 SET DATA KE FORM
  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        // FIX timezone bug
        date: data.date ? data.date.substring(0, 10) : ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put(`/transactions/${data.id}`, form);
      onClose();
      refresh();
    } catch (err) {
      console.error(err);
      alert("Gagal update");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !data) return null;
console.log("DATE RAW:", data.date);
console.log("TYPE:", typeof data.date);
  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-[999]">

        {/* 🔥 BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 z-[998]"
          onClick={onClose}
        />

        {/* 🔥 MODAL */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md z-[999]"
        >
          <h2 className="text-xl font-bold mb-4">Edit Transaksi</h2>

          <form onSubmit={handleSubmit} className="space-y-3">

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Jumlah"
              required
            />

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Kategori"
              required
            />

            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Deskripsi"
            />

            <input
              type="date"
              name="date"
              value={form.date || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default EditModal;