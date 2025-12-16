import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { invoiceService } from '../services/api';
import type { Invoice, InvoiceCreateRequest } from '../types';
import InvoiceModal from '../components/InvoiceModal';
import { getUserDisplayRole } from '../utils/userUtils';
import '../styles/Management.css';

const Invoices = () => {
  const { user, logout, isAdmin } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load invoices';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvoice = () => {
    setEditingInvoice(null);
    setShowModal(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowModal(true);
  };

  const handleDeleteInvoice = async (invoiceNo: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await invoiceService.deleteInvoice(invoiceNo);
      await loadInvoices();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete invoice';
      setError(message);
    }
  };

  const handleSaveInvoice = async (invoiceData: InvoiceCreateRequest) => {
    try {
      if (editingInvoice) {
        await invoiceService.updateInvoice(editingInvoice.invoiceNo, invoiceData);
      } else {
        await invoiceService.createInvoice(invoiceData);
      }
      setShowModal(false);
      await loadInvoices();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save invoice';
      throw new Error(message);
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.supplierId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Invoice Management</h1>
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
            <Link to="/invoices" className="btn btn-link active">Invoices</Link>
            <Link to="/batches" className="btn btn-link">Product Batches</Link>
            <Link to="/sales" className="btn btn-link">Sales</Link>
            {isAdmin() && (
              <Link to="/users" className="btn btn-link">Users</Link>
            )}
          </div>
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {isAdmin() && (
            <button onClick={handleAddInvoice} className="btn btn-primary">
              Add Invoice
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading invoices...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Supplier ID</th>
                  <th>Date</th>
                  <th>Created At</th>
                  {isAdmin() && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin() ? 5 : 4} className="no-data">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.invoiceNo}>
                      <td>{invoice.invoiceNo}</td>
                      <td>{invoice.supplierId}</td>
                      <td>{new Date(invoice.date).toLocaleDateString()}</td>
                      <td>{invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : '-'}</td>
                      {isAdmin() && (
                        <td className="actions">
                          <button 
                            onClick={() => handleEditInvoice(invoice)} 
                            className="btn btn-small btn-secondary"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteInvoice(invoice.invoiceNo)} 
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
        <InvoiceModal
          invoice={editingInvoice}
          onSave={handleSaveInvoice}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Invoices;
