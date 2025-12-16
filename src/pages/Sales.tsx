import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { transactionService } from '../services/api';
import type { Transaction, TransactionCreateRequest } from '../types';
import TransactionModal from '../components/TransactionModal';
import { getUserDisplayRole } from '../utils/userUtils';
import '../styles/Management.css';

const Sales = () => {
  const { user, logout, isAdmin } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load sales transactions';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await transactionService.deleteTransaction(transactionId);
      await loadTransactions();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(message);
    }
  };

  const handleSaveTransaction = async (transactionData: TransactionCreateRequest) => {
    try {
      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction.transactionId, transactionData);
      } else {
        await transactionService.createTransaction(transactionData);
      }
      setShowModal(false);
      await loadTransactions();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save transaction';
      throw new Error(message);
    }
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Sales Management</h1>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">{getUserDisplayRole(user)}</span>
            <button onClick={logout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </header>

      <div className="page-content">
        <div className="toolbar">
          <div className="nav-links">
            <Link to="/dashboard" className="btn btn-link">Dashboard</Link>
            <Link to="/suppliers" className="btn btn-link">Suppliers</Link>
            <Link to="/invoices" className="btn btn-link">Invoices</Link>
            <Link to="/batches" className="btn btn-link">Product Batches</Link>
            <Link to="/sales" className="btn btn-link active">Sales</Link>
            {isAdmin() && (
              <Link to="/users" className="btn btn-link">Users</Link>
            )}
          </div>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {isAdmin() && (
            <button onClick={handleAddTransaction} className="btn btn-primary">
              New Sale
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading transactions...</div>
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
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Created</th>
                  {isAdmin() && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin() ? 9 : 8} className="no-data">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.transactionId}>
                      <td>{transaction.transactionId}</td>
                      <td>{transaction.paymentMethod}</td>
                      <td>${transaction.grossAmount.toFixed(2)}</td>
                      <td>${transaction.discountAmount.toFixed(2)}</td>
                      <td>${transaction.netAmount.toFixed(2)}</td>
                      <td>${transaction.paidAmount.toFixed(2)}</td>
                      <td>${transaction.balanceAmount.toFixed(2)}</td>
                      <td>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : '-'}</td>
                      {isAdmin() && (
                        <td className="actions">
                          <button 
                            onClick={() => handleEditTransaction(transaction)} 
                            className="btn btn-small btn-secondary"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTransaction(transaction.transactionId)} 
                            className="btn btn-small btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <TransactionModal
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Sales;
