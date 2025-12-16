import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Supplier, SupplierCreateRequest } from '../types';
import '../styles/Modal.css';

interface SupplierModalProps {
  supplier: Supplier | null;
  onSave: (supplier: SupplierCreateRequest) => Promise<void>;
  onClose: () => void;
}

const SupplierModal = ({ supplier, onSave, onClose }: SupplierModalProps) => {
  const [supplierId, setSupplierId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplier) {
      setSupplierId(supplier.supplierId);
      setName(supplier.name);
      setEmail(supplier.email);
      setAddress(supplier.address);
      setContact(supplier.contact);
    }
  }, [supplier]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!supplierId.trim()) {
      setError('Supplier ID is required');
      return;
    }

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    try {
      await onSave({
        supplierId,
        name,
        email,
        address,
        contact,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save supplier');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="supplierId">Supplier ID</label>
            <input
              id="supplierId"
              type="text"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
              disabled={loading || !!supplier}
              placeholder="Enter supplier ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter supplier name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact">Contact</label>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter contact number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter supplier address"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;
