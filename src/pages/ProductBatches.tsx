import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { productBatchService } from '../services/api';
import type { ProductBatch, ProductBatchCreateRequest } from '../types';
import ProductBatchModal from '../components/ProductBatchModal';
import '../styles/Management.css';

const ProductBatches = () => {
  const { user, logout, isAdmin } = useAuth();
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ProductBatch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      setLoading(true);
      const data = await productBatchService.getAllProductBatches();
      setBatches(data);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load product batches';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = () => {
    setEditingBatch(null);
    setShowModal(true);
  };

  const handleEditBatch = (batch: ProductBatch) => {
    setEditingBatch(batch);
    setShowModal(true);
  };

  const handleDeleteBatch = async (productId: string, invoiceNo: string) => {
    if (!window.confirm('Are you sure you want to delete this product batch?')) {
      return;
    }

    try {
      await productBatchService.deleteProductBatch(productId, invoiceNo);
      await loadBatches();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product batch';
      setError(message);
    }
  };

  const handleSaveBatch = async (batchData: ProductBatchCreateRequest) => {
    try {
      if (editingBatch) {
        await productBatchService.updateProductBatch(
          editingBatch.productId,
          editingBatch.invoiceNo,
          batchData
        );
      } else {
        await productBatchService.createProductBatch(batchData);
      }
      setShowModal(false);
      await loadBatches();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save product batch';
      throw new Error(message);
    }
  };

  const filteredBatches = batches.filter(batch =>
    batch.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-page">
      <header className="page-header">
        <div className="header-content">
          <h1>Product Batch Management</h1>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">{user?.roles[1] ? user.roles[1] : user?.roles[0]}</span>
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
            <Link to="/batches" className="btn btn-link active">Product Batches</Link>
            <Link to="/sales" className="btn btn-link">Sales</Link>
            {isAdmin() && (
              <Link to="/users" className="btn btn-link">Users</Link>
            )}
          </div>
          <input
            type="text"
            placeholder="Search batches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {isAdmin() && (
            <button onClick={handleAddBatch} className="btn btn-primary">
              Add Product Batch
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading product batches...</div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Invoice No</th>
                  <th>Batch No</th>
                  <th>Quantity</th>
                  <th>Unit Cost</th>
                  <th>Unit Price</th>
                  <th>Expiry</th>
                  {isAdmin() && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin() ? 8 : 7} className="no-data">
                      No product batches found
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch) => (
                    <tr key={`${batch.productId}-${batch.invoiceNo}`}>
                      <td>{batch.productId}</td>
                      <td>{batch.invoiceNo}</td>
                      <td>{batch.batchNo}</td>
                      <td>{batch.qty}</td>
                      <td>${batch.unitCost.toFixed(2)}</td>
                      <td>${batch.unitPrice.toFixed(2)}</td>
                      <td>{batch.exp ? new Date(batch.exp).toLocaleDateString() : '-'}</td>
                      {isAdmin() && (
                        <td className="actions">
                          <button 
                            onClick={() => handleEditBatch(batch)} 
                            className="btn btn-small btn-secondary"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteBatch(batch.productId, batch.invoiceNo)} 
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
        <ProductBatchModal
          batch={editingBatch}
          onSave={handleSaveBatch}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ProductBatches;
