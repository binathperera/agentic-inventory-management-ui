import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supplierService } from '../services/api';
import type { Supplier, SupplierCreateRequest } from '../types';
import SupplierModal from '../components/SupplierModal';
import { getUserDisplayRole } from '../utils/userUtils';
import '../styles/Management.css';

const Suppliers = () => {
  const { user, logout, isAdmin } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load suppliers';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setShowModal(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) {
      return;
    }

    try {
      await supplierService.deleteSupplier(supplierId);
      await loadSuppliers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete supplier';
      setError(message);
    }
  };

  const handleSaveSupplier = async (supplierData: SupplierCreateRequest) => {
    try {
      if (editingSupplier) {
        await supplierService.updateSupplier(editingSupplier.supplierId, supplierData);
      } else {
        await supplierService.createSupplier(supplierData);
      }
      setShowModal(false);
      await loadSuppliers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save supplier';
      throw new Error(message);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.supplierId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Supplier Management</h1>
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
            <Link to="/suppliers" className="btn btn-link active">Suppliers</Link>
            <Link to="/invoices" className="btn btn-link">Invoices</Link>
            <Link to="/batches" className="btn btn-link">Product Batches</Link>
            <Link to="/sales" className="btn btn-link">Sales</Link>
            {isAdmin() && (
              <Link to="/users" className="btn btn-link">Users</Link>
            )}
          </div>
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {isAdmin() && (
            <button onClick={handleAddSupplier} className="btn btn-primary">
              Add Supplier
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading suppliers...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Supplier ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Address</th>
                  {isAdmin() && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin() ? 6 : 5} className="no-data">
                      No suppliers found
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <tr key={supplier.supplierId}>
                      <td>{supplier.supplierId}</td>
                      <td>{supplier.name}</td>
                      <td>{supplier.email}</td>
                      <td>{supplier.contact}</td>
                      <td>{supplier.address}</td>
                      {isAdmin() && (
                        <td className="actions">
                          <button 
                            onClick={() => handleEditSupplier(supplier)} 
                            className="btn btn-small btn-secondary"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteSupplier(supplier.supplierId)} 
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
        <SupplierModal
          supplier={editingSupplier}
          onSave={handleSaveSupplier}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Suppliers;
