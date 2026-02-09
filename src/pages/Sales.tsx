import { useState, useEffect, useMemo } from "react";
import { transactionService, productService } from "../services/api";
import type { Transaction, Product } from "../types";
import Navigation from "../components/Navigation";
import SaleModal from "../components/SaleModal";
import "../styles/Suppliers.css";
import type { AxiosError } from "axios";

interface ErrorResponse {
  message?: string;
}

const Sales = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
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
      let message = "Failed to load transactions";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const axiosError = err as AxiosError<ErrorResponse>;
        if (axiosError.code === "ERR_NETWORK" && !axiosError.response) {
          message = "CORS Error: Cannot connect to backend API. Please ensure the backend is running and the dev server has been restarted.";
        } else if (axiosError.response?.status === 400) {
          const backendMsg = (axiosError.response?.data as ErrorResponse)?.message;
          message = backendMsg ? `Error: ${backendMsg}` : "Bad Request (400): Invalid request to server";
        } else if (axiosError.response?.status === 403) {
          message = "Access denied: You don't have permission to view transactions";
        } else if (axiosError.response?.status === 401) {
          message = "Authentication failed: Please log in again";
        } else if (axiosError.response?.status === 500) {
          message = "Server error: Please try again later";
        } else if ((axiosError.response?.data as ErrorResponse)?.message) {
          message = (axiosError.response?.data as ErrorResponse)?.message ?? "An error occurred";
        } else if (axiosError.message === "Network Error") {
          message = "Network error: Unable to connect to the server";
        }
      }
      const axiosErr = err as AxiosError<ErrorResponse>;
      console.error("[Sales] Load error - Status:", axiosErr?.response?.status, "Message:", axiosErr?.response?.data?.message);
      console.error("[Sales] Full error:", err);
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (!transaction || !transaction.transactionId) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        transaction.transactionId.toLowerCase().includes(searchLower) ||
        (transaction.paymentMethod?.toLowerCase()?.includes(searchLower) ?? false);
      
      const matchesPayment =
        filterPaymentMethod === "all" ||
        transaction.paymentMethod === filterPaymentMethod;
        
      return matchesSearch && matchesPayment;
    });
  }, [transactions, searchTerm, filterPaymentMethod]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "amount") return b.netAmount - a.netAmount;
      return 0;
    });
  }, [filteredTransactions, sortBy]);

  // Calculate sales statistics
  const totalSales = transactions.filter(t => t && t.id).length;
  const totalRevenue = transactions.reduce((sum, t) => 
    t?.netAmount ? sum + t.netAmount : sum, 0);
  const totalPaid = transactions.reduce((sum, t) => 
    t?.paidAmount ? sum + t.paidAmount : sum, 0);
  const totalPending = transactions.reduce((sum, t) => 
    t?.balanceAmount ? sum + t.balanceAmount : sum, 0);
  
  const paymentMethods = [
    ...new Set(
      transactions
        .filter(t => t?.paymentMethod)
        .map((t) => t.paymentMethod)
    ),
  ];

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Sales Management</h1>
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
              <div className="stat-label">Total Received</div>
              <div className="stat-value">${totalPaid.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-label">Pending</div>
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
              + Add Transaction
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading transactions...</div>
          ) : sortedTransactions.length === 0 ? (
            <div className="no-data">
              <p>No sales transactions found</p>
              <button onClick={handleCreateSale} className="btn btn-primary">
                Add first transaction
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
                    <tr key={transaction.id || transaction.transactionId}>
                      <td>{transaction.transactionId}</td>
                      <td>{transaction.paymentMethod}</td>
                      <td>${(transaction.grossAmount || 0).toFixed(2)}</td>
                      <td>${(transaction.discountAmount || 0).toFixed(2)}</td>
                      <td>${(transaction.netAmount || 0).toFixed(2)}</td>
                      <td>${(transaction.paidAmount || 0).toFixed(2)}</td>
                      <td>${(transaction.balanceAmount || 0).toFixed(2)}</td>
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
                              handleDeleteTransaction(transaction.id || transaction.transactionId!)
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
