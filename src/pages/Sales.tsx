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
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
<<<<<<< Updated upstream
  const [searchTerm, setSearchTerm] = useState('');
=======
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
>>>>>>> Stashed changes

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
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
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
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionService.deleteTransaction(id);
      await loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(message);
    }
  };

<<<<<<< Updated upstream
  const filteredTransactions = transactions.filter(transaction =>
    transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );
=======
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
>>>>>>> Stashed changes

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Sales Management</h1>
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
        </div>

        <div className="content-wrapper">
          <div className="toolbar">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleCreateSale} className="btn btn-primary">
              Create Sale
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading transactions...</div>
          ) : (
            <div className="table-container">
<<<<<<< Updated upstream
              {filteredTransactions.length === 0 ? (
                <p className="no-data">No transactions found</p>
              ) : (
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
=======
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
>>>>>>> Stashed changes
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.transactionId}>
                        <td>{transaction.transactionId}</td>
                        <td>{transaction.paymentMethod}</td>
                        <td>${transaction.grossAmount.toFixed(2)}</td>
                        <td>${transaction.discountAmount.toFixed(2)}</td>
                        <td>${transaction.netAmount.toFixed(2)}</td>
                        <td>${transaction.paidAmount.toFixed(2)}</td>
                        <td>${transaction.balanceAmount.toFixed(2)}</td>
                        <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleViewTransaction(transaction)}
                              className="btn btn-small btn-secondary"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.transactionId)}
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
              )}
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
