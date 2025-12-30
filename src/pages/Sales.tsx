import { useState, useEffect } from "react";
import { transactionService, productService } from "../services/api";
import type { Transaction, Product } from "../types";
import Navigation from "../components/Navigation";
import SaleModal from "../components/SaleModal";
import "../styles/Suppliers.css";

const Sales = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewingTransaction, setViewingTransaction] =
    useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, productsData] = await Promise.all([
        transactionService.getAllTransactions(),
        productService.getAllProducts(),
      ]);
      setTransactions(transactionsData);
      setProducts(productsData);
      setError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSale = () => {
    setViewingTransaction(null);
    setShowModal(true);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setViewingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      await transactionService.deleteTransaction(id);
      await loadData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete transaction";
      setError(message);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.transactionId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.paymentMethod
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesPayment =
      filterPaymentMethod === "all" ||
      transaction.paymentMethod === filterPaymentMethod;
    return matchesSearch && matchesPayment;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "recent")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "amount") return b.netAmount - a.netAmount;
    return 0;
  });

  // Calculate sales statistics
  const totalSales = transactions.length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.netAmount, 0);
  const totalPaid = transactions.reduce((sum, t) => sum + t.paidAmount, 0);
  const totalPending = transactions.reduce(
    (sum, t) => sum + t.balanceAmount,
    0
  );
  const paymentMethods = [
    ...new Set(transactions.map((t) => t.paymentMethod).filter(Boolean)),
  ];

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Sales Management</h1>
          {/* <p className="subtitle">Track sales transactions and revenue</p> */}
        </div>

        {/* Sales Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-content">
              <div className="stat-label">Total Sales</div>
              <div className="stat-value">{totalSales}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💵</div>
            <div className="stat-content">
              <div className="stat-label">Total Revenue</div>
              <div className="stat-value">${totalRevenue.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-label">Total Paid</div>
              <div className="stat-value">${totalPaid.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-label">Pending Amount</div>
              <div
                className="stat-value"
                style={{ color: totalPending > 0 ? "#ff9800" : "#28a745" }}
              >
                ${totalPending.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="toolbar">
            <div className="toolbar-section">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="toolbar-section">
              <select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Payment Methods</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="recent">Most Recent</option>
                <option value="amount">Highest Amount</option>
              </select>
            </div>

            <button onClick={handleCreateSale} className="btn btn-primary">
              + Create Sale
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading transactions...</div>
          ) : sortedTransactions.length === 0 ? (
            <div className="no-data">
              <p>No sales transactions found</p>
              <button onClick={handleCreateSale} className="btn btn-primary">
                Create First Sale
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Payment Method</th>
                    <th>Gross Amount</th>
                    <th>Discount</th>
                    <th>Net Amount</th>
                    <th>Paid Amount</th>
                    <th>Balance</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTransactions.map((transaction) => (
                    <tr key={transaction.transactionId}>
                      <td>{transaction.transactionId}</td>
                      <td>{transaction.paymentMethod}</td>
                      <td>${transaction.grossAmount.toFixed(2)}</td>
                      <td>${transaction.discountAmount.toFixed(2)}</td>
                      <td>${transaction.netAmount.toFixed(2)}</td>
                      <td>${transaction.paidAmount.toFixed(2)}</td>
                      <td>${transaction.balanceAmount.toFixed(2)}</td>
                      <td>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleViewTransaction(transaction)}
                            className="btn btn-small btn-secondary"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteTransaction(transaction.transactionId)
                            }
                            className="btn btn-small btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && (
          <SaleModal
            transaction={viewingTransaction}
            products={products}
            onSave={async () => {
              setShowModal(false);
              await loadData();
            }}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Sales;
