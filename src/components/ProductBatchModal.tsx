import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { ProductBatch, ProductBatchCreateRequest } from '../types';
import '../styles/Modal.css';

interface ProductBatchModalProps {
  batch: ProductBatch | null;
  onSave: (batch: ProductBatchCreateRequest) => Promise<void>;
  onClose: () => void;
}

const ProductBatchModal = ({ batch, onSave, onClose }: ProductBatchModalProps) => {
  const [productId, setProductId] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [qty, setQty] = useState(0);
  const [unitCost, setUnitCost] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [exp, setExp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (batch) {
      setProductId(batch.productId);
      setInvoiceNo(batch.invoiceNo);
      setBatchNo(batch.batchNo);
      setQty(batch.qty);
      setUnitCost(batch.unitCost);
      setUnitPrice(batch.unitPrice);
      setExp(batch.exp ? batch.exp.split('T')[0] : '');
    }
  }, [batch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!productId.trim()) {
      setError('Product ID is required');
      return;
    }

    if (!invoiceNo.trim()) {
      setError('Invoice number is required');
      return;
    }

    if (!batchNo.trim()) {
      setError('Batch number is required');
      return;
    }

    if (qty <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (unitCost < 0) {
      setError('Unit cost cannot be negative');
      return;
    }

    if (unitPrice < 0) {
      setError('Unit price cannot be negative');
      return;
    }

    setLoading(true);

    try {
      await onSave({
        productId,
        invoiceNo,
        batchNo,
        qty,
        unitCost,
        unitPrice,
        exp: exp || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product batch');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{batch ? 'Edit Product Batch' : 'Add New Product Batch'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="productId">Product ID</label>
            <input
              id="productId"
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              disabled={loading || !!batch}
              placeholder="Enter product ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="invoiceNo">Invoice Number</label>
            <input
              id="invoiceNo"
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              required
              disabled={loading || !!batch}
              placeholder="Enter invoice number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="batchNo">Batch Number</label>
            <input
              id="batchNo"
              type="text"
              value={batchNo}
              onChange={(e) => setBatchNo(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter batch number"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="qty">Quantity</label>
              <input
                id="qty"
                type="number"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                required
                disabled={loading}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="unitCost">Unit Cost ($)</label>
              <input
                id="unitCost"
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                required
                disabled={loading}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="unitPrice">Unit Price ($)</label>
              <input
                id="unitPrice"
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                required
                disabled={loading}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="exp">Expiry Date (Optional)</label>
            <input
              id="exp"
              type="date"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductBatchModal;
