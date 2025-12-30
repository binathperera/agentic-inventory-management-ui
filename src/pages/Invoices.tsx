import { useState, useEffect } from "react";
import { invoiceService, supplierService } from "../services/api";
import type { Invoice, Supplier } from "../types";
import Navigation from "../components/Navigation";
import InvoiceModal from "../components/InvoiceModal";
import { FileText, Building2, Calendar } from "lucide-react";
import "../styles/Suppliers.css";

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [invoicesData, suppliersData] = await Promise.all([
        invoiceService.getAllInvoices(),
        supplierService.getAllSuppliers(),
      ]);
      setInvoices(invoicesData);
      setSuppliers(suppliersData);
      setError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data";
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

  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) {
      return;
    }

    try {
      await invoiceService.deleteInvoice(id);
      await loadData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete invoice";
      setError(message);
    }
  };

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? supplier.name : supplierId;
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getSupplierName(invoice.supplierId)
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesSupplier =
      filterSupplier === "all" || invoice.supplierId === filterSupplier;
    return matchesSearch && matchesSupplier;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    if (sortBy === "date")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "invoiceNo") return a.invoiceNo.localeCompare(b.invoiceNo);
    if (sortBy === "supplier")
      return getSupplierName(a.supplierId).localeCompare(
        getSupplierName(b.supplierId)
      );
    return 0;
  });

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Invoice Management</h1>
          {/* <p className="subtitle">Track purchase invoices and orders</p> */}
        </div>

        {/* Invoice Statistics */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={32} color="#3b82f6" />
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Invoices</div>
              <div className="stat-value">{invoices.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Building2 size={32} color="#8b5cf6" />
            </div>
            <div className="stat-content">
              <div className="stat-label">Suppliers</div>
              <div className="stat-value">
                {[...new Set(invoices.map((i) => i.supplierId))].length}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={32} color="#10b981" />
            </div>
            <div className="stat-content">
              <div className="stat-label">This Month</div>
              <div className="stat-value">
                {
                  invoices.filter((i) => {
                    const date = new Date(i.date);
                    const now = new Date();
                    return (
                      date.getMonth() === now.getMonth() &&
                      date.getFullYear() === now.getFullYear()
                    );
                  }).length
                }
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-label">Recent (7 days)</div>
              <div className="stat-value">
                {
                  invoices.filter((i) => {
                    const date = new Date(i.date);
                    const now = new Date();
                    const diffTime = Math.abs(now.getTime() - date.getTime());
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 7;
                  }).length
                }
              </div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="toolbar">
            <div className="toolbar-section">
              <input
                type="text"
                placeholder="Search by invoice number or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="toolbar-section">
              <select
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Suppliers</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="date">Sort by Date</option>
                <option value="invoiceNo">Sort by Invoice #</option>
                <option value="supplier">Sort by Supplier</option>
              </select>
            </div>

            <button onClick={handleAddInvoice} className="btn btn-primary">
              + Add Invoice
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading invoices...</div>
          ) : sortedInvoices.length === 0 ? (
            <div className="no-data">
              <p>No invoices found</p>
              <button onClick={handleAddInvoice} className="btn btn-primary">
                Create First Invoice
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice No</th>
                    <th>Supplier</th>
                    <th>Date</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvoices.map((invoice) => (
                    <tr key={invoice.invoiceNo}>
                      <td>{invoice.invoiceNo}</td>
                      <td>{getSupplierName(invoice.supplierId)}</td>
                      <td>{new Date(invoice.date).toLocaleDateString()}</td>
                      <td>{new Date(invoice.date).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEditInvoice(invoice)}
                            className="btn btn-small btn-secondary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteInvoice(invoice.invoiceNo)
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
          <InvoiceModal
            invoice={editingInvoice}
            suppliers={suppliers}
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

export default Invoices;
