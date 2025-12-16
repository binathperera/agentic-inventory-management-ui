import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Invoice, InvoiceCreateRequest } from '../types';
import '../styles/Modal.css';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onSave: (invoice: InvoiceCreateRequest) => Promise<void>;
  onClose: () => void;
}

const InvoiceModal = ({ invoice, onSave, onClose }: InvoiceModalProps) => {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (invoice) {
      setInvoiceNo(invoice.invoiceNo);
      setSupplierId(invoice.supplierId);
      setDate(invoice.date.split('T')[0]); // Format date for input
    }
  }, [invoice]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!invoiceNo.trim()) {
      setError('Invoice number is required');
      return;
    }

    if (!supplierId.trim()) {
      setError('Supplier ID is required');
      return;
    }

    if (!date) {
      setError('Date is required');
      return;
    }

    setLoading(true);

    try {
      await onSave({
        invoiceNo,
        supplierId,
        date,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save invoice');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{invoice ? 'Edit Invoice' : 'Add New Invoice'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="invoiceNo">Invoice Number</label>
            <input
              id="invoiceNo"
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              required
              disabled={loading || !!invoice}
              placeholder="Enter invoice number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="supplierId">Supplier ID</label>
            <input
              id="supplierId"
              type="text"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter supplier ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal;
