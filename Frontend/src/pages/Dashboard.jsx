// ================= IMPORTS =================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard() {

  const navigate = useNavigate();

  // ================= STATES =================

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [budget, setBudget] = useState(localStorage.getItem("budget") || 0);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [sortType, setSortType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [darkMode, setDarkMode] = useState(true);

  const token = localStorage.getItem("token");

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f97316",
    "#ef4444",
    "#14b8a6",
  ];

  // ================= USE EFFECT =================

  useEffect(() => {

    if (!token) {
      navigate("/");
      return;
    }

    fetchExpenses();
    fetchMonthlySummary();

  // eslint-disable-next-line

  }, [token]);

  // ================= FETCH EXPENSES =================

  const fetchExpenses = async () => {

    setLoading(true);

    const res = await fetch("http://127.0.0.1:5000/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    setExpenses(Array.isArray(data.data) ? data.data : []);
    setLoading(false);

  };

  // ================= FETCH MONTHLY =================

  const fetchMonthlySummary = async () => {

    const res = await fetch(
      "http://127.0.0.1:5000/expenses/monthly-summary",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    if (data.data) {

      const formatted = Object.entries(data.data).map(
        ([month, total]) => ({ month, total })
      );

      setMonthlyData(formatted);

    }

  };

  // ================= ADD EXPENSE =================

  const handleAddExpense = async () => {

    if (!category || !amount) {
      toast.error("Please fill all fields");
      return;
    }

    await fetch("http://127.0.0.1:5000/expenses", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        category,
        amount: parseFloat(amount),
        date: new Date().toISOString().slice(0, 10),
      }),

    });

    setCategory("");
    setAmount("");

    toast.success("Expense Added");

    fetchExpenses();
    fetchMonthlySummary();

  };

  // ================= DELETE =================

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {

    await fetch(`http://127.0.0.1:5000/expenses/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowConfirm(false);
    setDeleteId(null);

    toast.success("Expense Deleted");

    fetchExpenses();
    fetchMonthlySummary();

  };

  // ================= EDIT =================

  const handleEditClick = (expense) => {

    setEditingId(expense.id);
    setEditCategory(expense.category);
    setEditAmount(expense.amount);

  };

  const handleUpdate = async () => {

    await fetch(`http://127.0.0.1:5000/expenses/${editingId}`, {

      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        category: editCategory,
        amount: parseFloat(editAmount),
      }),

    });

    setEditingId(null);

    toast.success("Expense Updated");

    fetchExpenses();
    fetchMonthlySummary();

  };

  // ================= EXPORT CSV =================

  const exportCSV = () => {

    if (expenses.length === 0) return;

    const headers = ["Category", "Amount", "Date"];

    const rows = expenses.map((e) => [
      e.category,
      e.amount,
      e.date,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "expenses.csv";
    a.click();

  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // ================= CALCULATIONS =================

  const totalAmount = expenses.reduce(
    (total, e) => total + Number(e.amount),
    0
  );

  const remainingBudget = budget > 0 ? budget - totalAmount : 0;

  const budgetUsedPercent =
    budget > 0 ? (totalAmount / budget) * 100 : 0;

  const progressColor =
    budgetUsedPercent > 100
      ? "bg-red-500"
      : budgetUsedPercent > 80
      ? "bg-yellow-400"
      : "bg-green-500";

  const categories = [...new Set(expenses.map((e) => e.category))];

  const categoryData = expenses.reduce((acc, e) => {

    const existing = acc.find((i) => i.name === e.category);

    if (existing)
      existing.value += Number(e.amount);
    else
      acc.push({ name: e.category, value: Number(e.amount) });

    return acc;

  }, []);

  const filteredExpenses = expenses
    .filter((e) =>
      e.category.toLowerCase().includes(search.toLowerCase())
    )
    .filter((e) => (filter ? e.category === filter : true))
    .filter((e) =>
      fromDate ? new Date(e.date) >= new Date(fromDate) : true
    )
    .filter((e) =>
      toDate ? new Date(e.date) <= new Date(toDate) : true
    )
    .sort((a, b) => {

      if (sortType === "high") return b.amount - a.amount;
      if (sortType === "low") return a.amount - b.amount;
      if (sortType === "new") return new Date(b.date) - new Date(a.date);
      if (sortType === "old") return new Date(a.date) - new Date(b.date);

      return 0;

    });

  // ================= UI =================

  return (

    <div className={`min-h-screen p-10 ${darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-black"}`}>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-3xl font-bold">
          Expense Dashboard
        </h1>

        <div className="flex gap-3">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-700 px-4 py-2 rounded-lg"
          >
            {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-4 gap-6 mb-10">

        <div className="bg-gray-900 p-6 rounded-xl">
          <p>Budget</p>
          <h2 className="text-3xl text-yellow-400 font-bold">₹{budget}</h2>
          <p className="text-sm text-gray-400">
            Remaining: ₹{remainingBudget}
          </p>

          <div className="w-full bg-gray-700 h-2 rounded mt-3">
            <div
              className={`${progressColor} h-2 rounded`}
              style={{ width: `${budgetUsedPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p>Total Expense</p>
          <h2 className="text-3xl text-green-400 font-bold">
            ₹{totalAmount}
          </h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p>Transactions</p>
          <h2 className="text-3xl font-bold">{expenses.length}</h2>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl">
          <p>This Month</p>
          <h2 className="text-3xl text-indigo-400 font-bold">
            ₹{monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].total : 0}
          </h2>
        </div>

      </div>

      {/* MAIN */}

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}

        <div>

          {/* FILTER BAR */}

          <div className="flex gap-3 mb-6 flex-wrap">

            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 bg-gray-800 rounded"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 bg-gray-800 rounded"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="p-2 bg-gray-800 rounded"
            >
              <option value="">Sort</option>
              <option value="high">Highest</option>
              <option value="low">Lowest</option>
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
            </select>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="p-2 bg-gray-800 rounded"
            />

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="p-2 bg-gray-800 rounded"
            />

            <button
              onClick={() => {
                setSearch("");
                setFilter("");
                setSortType("");
                setFromDate("");
                setToDate("");
                setExpenses([...expenses]);
              }}
              className="bg-gray-700 px-3 py-2 rounded"
            >
              Clear Filters
            </button>

            <button
              onClick={exportCSV}
              className="bg-indigo-600 px-3 py-2 rounded"
            >
              Export CSV
            </button>

          </div>

          {/* ADD EXPENSE */}

          <div className="bg-gray-900 p-6 rounded-xl mb-6">

            <input
              type="number"
              placeholder="Set Monthly Budget"
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
                localStorage.setItem("budget", e.target.value);
              }}
              className="w-full mb-3 p-2 bg-gray-800 rounded"
            />

            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-3 p-2 bg-gray-800 rounded"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mb-3 p-2 bg-gray-800 rounded"
            />

            <button
              onClick={handleAddExpense}
              className="w-full bg-indigo-600 p-2 rounded"
            >
              Add Expense
            </button>

          </div>

          {/* EXPENSE LIST */}

          <ul className="space-y-4">

            {filteredExpenses.length === 0 ? (

              <p className="text-gray-400 text-center">
                No expenses found
              </p>

            ) : (

              filteredExpenses.map((e) => (

                <li key={e.id} className="bg-gray-900 p-4 rounded">

                  <div className="flex justify-between">

                    <div>

                      {editingId === e.id ? (

                        <input
                          value={editCategory}
                          onChange={(x) => setEditCategory(x.target.value)}
                          className="bg-gray-800 p-1 rounded"
                        />

                      ) : (

                        <p>{e.category}</p>

                      )}

                      <p className="text-sm text-gray-400">{e.date}</p>

                    </div>

                    <div>

                      {editingId === e.id ? (

                        <input
                          type="number"
                          value={editAmount}
                          onChange={(x) => setEditAmount(x.target.value)}
                          className="bg-gray-800 p-1 rounded w-24"
                        />

                      ) : (

                        <p className="text-green-400 font-bold">
                          ₹{e.amount}
                        </p>

                      )}

                      <div className="flex gap-2 mt-2 justify-end">

                        {editingId === e.id ? (
                          <>
                            <button
                              onClick={handleUpdate}
                              className="bg-green-600 px-3 py-1 rounded text-sm"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => setEditingId(null)}
                              className="bg-gray-600 px-3 py-1 rounded text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(e)}
                              className="bg-yellow-500 px-3 py-1 rounded text-sm"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => confirmDelete(e.id)}
                              className="bg-red-600 px-3 py-1 rounded text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}

                      </div>

                    </div>

                  </div>

                </li>

              ))

            )}

          </ul>

        </div>   {/* LEFT SIDE CLOSED HERE */}

        {/* RIGHT SIDE CHARTS */}

        <div className="bg-gray-900 p-6 rounded-xl h-fit">

          <h2 className="text-xl font-bold mb-4">
            Category Distribution
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <h2 className="text-xl font-bold mt-8 mb-4">
            Monthly Spending
          </h2>

          <div className="mt-10">

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={monthlyData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />
                <YAxis />

                <Tooltip />

                <Bar dataKey="total" fill="#6366f1" />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* DELETE MODAL */}

      {showConfirm && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">

          <div className="bg-gray-900 p-6 rounded-xl">

            <p className="mb-4">Delete this expense?</p>

            <div className="flex gap-3">

              <button
                onClick={handleDelete}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

      <ToastContainer position="top-right" autoClose={2000} />

    </div>

  );

}

export default Dashboard;