import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { Product } from "../types";
import "../styles/Modal.css";

interface ProductModalProps {
  product: Product | null;
  onSave: (productData: {
    id?: string;
    name: string;
    latestBatchNo?: string;
    remainingQuantity?: number;
    latestUnitPrice?: number;
  }) => Promise<void>;
  onClose: () => void;
}

const ProductModal = ({ product, onSave, onClose }: ProductModalProps) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [latestBatchNo, setLatestBatchNo] = useState("");
  const [remainingQuantity, setRemainingQuantity] = useState(0);
  const [latestUnitPrice, setLatestUnitPrice] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setId(product.id);
      setName(product.name);
      setLatestBatchNo(product.latestBatchNo || "");
      setRemainingQuantity(product.remainingQuantity ?? 0);
      setLatestUnitPrice(product.latestUnitPrice ?? 0);
    } else {
      setId("");
      setName("");
      setLatestBatchNo("");
      setRemainingQuantity(0);
      setLatestUnitPrice(0);
    }
  }, [product]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!latestBatchNo.trim()) {
      setError("Batch number is required");
      return;
    }

    if (remainingQuantity < 0) {
      setError("Quantity cannot be negative");
      return;
    }

    if (latestUnitPrice < 0) {
      setError("Price cannot be negative");
      return;
    }

    setLoading(true);

    try {
      await onSave({
        id: product ? product.id : id,
        name,
        latestBatchNo,
        remainingQuantity,
        latestUnitPrice,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? "Edit Product" : "Add New Product"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          {!product && (
            <div className="form-group">
              <label htmlFor="id">Product ID *</label>
              <input
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter product ID/code"
              />
            </div>
          )}
          {product && (
            <div className="form-group">
              <label htmlFor="id">Product ID</label>
              <input id="id" type="text" value={id} disabled />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="latestBatchNo">Latest Batch No *</label>
            <input
              id="latestBatchNo"
              type="text"
              value={latestBatchNo}
              onChange={(e) => setLatestBatchNo(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter batch number"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="remainingQuantity">Remaining Quantity</label>
              <input
                id="remainingQuantity"
                type="number"
                value={remainingQuantity}
                onChange={(e) => setRemainingQuantity(Number(e.target.value))}
                disabled={loading}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="latestUnitPrice">Latest Unit Price ($)</label>
              <input
                id="latestUnitPrice"
                type="number"
                step="0.01"
                value={latestUnitPrice}
                onChange={(e) => setLatestUnitPrice(Number(e.target.value))}
                disabled={loading}
                min="0"
              />
            </div>
          </div>

          {product && (
            <small
              style={{
                color: "#666",
                fontSize: "12px",
                marginTop: "10px",
                display: "block",
              }}
            >
              Note: Product details are typically updated through Product
              Batches. Use this form for manual adjustments only.
            </small>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
