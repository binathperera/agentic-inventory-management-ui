import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Transaction, TransactionCreateRequest } from '../types';
import '../styles/Modal.css';

interface TransactionModalProps {
  transaction: Transaction | null;
  onSave: (transaction: TransactionCreateRequest) => Promise<void>;
  onClose: () => void;
}

const TransactionModal = ({ transaction, onSave, onClose }: TransactionModalProps) => {
  const [transactionId, setTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [grossAmount, setGrossAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setTransactionId(transaction.transactionId);
      setPaymentMethod(transaction.paymentMethod);
      setGrossAmount(transaction.grossAmount);
      setDiscountAmount(transaction.discountAmount);
      setNetAmount(transaction.netAmount);
      setPaidAmount(transaction.paidAmount);
      setBalanceAmount(transaction.balanceAmount);
    }
  }, [transaction]);

  // Auto-calculate net amount and balance
  useEffect(() => {
    const calculatedNetAmount = grossAmount - discountAmount;
    setNetAmount(calculatedNetAmount);
    setBalanceAmount(calculatedNetAmount - paidAmount);
  }, [grossAmount, discountAmount, paidAmount]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!transactionId.trim()) {
      setError('Transaction ID is required');
      return;
    }

    if (grossAmount < 0) {
      setError('Gross amount cannot be negative');
      return;
    }

    if (discountAmount < 0) {
      setError('Discount amount cannot be negative');
      return;
    }

    if (paidAmount < 0) {
      setError('Paid amount cannot be negative');
      return;
    }

    setLoading(true);

    try {
      await onSave({
        transactionId,
        paymentMethod,
        grossAmount,
        discountAmount,
        netAmount,
        paidAmount,
        balanceAmount,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save transaction');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{transaction ? 'Edit Transaction' : 'New Sale Transaction'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="transactionId">Transaction ID</label>
            <input
              id="transactionId"
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              disabled={loading || !!transaction}
              placeholder="Enter transaction ID"
            />
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              disabled={loading}
            >
              <option value="CASH">Cash</option>
              <option value="CARD">Card</option>
              <option value="CREDIT">Credit</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="grossAmount">Gross Amount ($)</label>
              <input
                id="grossAmount"
                type="number"
                step="0.01"
                value={grossAmount}
                onChange={(e) => setGrossAmount(Number(e.target.value))}
                required
                disabled={loading}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="discountAmount">Discount ($)</label>
              <input
                id="discountAmount"
                type="number"
                step="0.01"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                required
                disabled={loading}
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="netAmount">Net Amount ($)</label>
              <input
                id="netAmount"
                type="number"
                step="0.01"
                value={netAmount}
                disabled
                className="calculated-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="paidAmount">Paid Amount ($)</label>
              <input
                id="paidAmount"
                type="number"
                step="0.01"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                required
                disabled={loading}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="balanceAmount">Balance ($)</label>
              <input
                id="balanceAmount"
                type="number"
                step="0.01"
                value={balanceAmount}
                disabled
                className="calculated-field"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
