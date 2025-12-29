import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  productBatchService,
  productService,
  invoiceService,
} from "../services/api";
import type { ProductBatch, Product, Invoice } from "../types";
import Navigation from "../components/Navigation";
import ProductBatchModal from "../components/ProductBatchModal";
import "../styles/Suppliers.css";

const ProductBatches = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSelectedProductId = searchParams.get("productId") || "";
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ProductBatch | null>(null);
  const [batchSearchTerm, setBatchSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(
    initialSelectedProductId
  );
  const [productSearchTerm, setProductSearchTerm] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const productParam = searchParams.get("productId") || "";
    setSelectedProductId(productParam);
    if (productParam) {
      loadBatchesForProduct(productParam);
    } else {
      setBatches([]);
    }
  }, [searchParams]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
      setError("");

      // Load invoices separately so failures don't block the page
      try {
        const invoicesData = await invoiceService.getAllInvoices();
        setInvoices(invoicesData);
      } catch (invoiceErr) {
        console.warn("Failed to load invoices:", invoiceErr);
        setInvoices([]);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load data";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadBatchesForProduct = async (productId: string) => {
    if (!productId) {
      setBatches([]);
      return;
    }

    try {
      setLoading(true);
      const batchesData = await productBatchService.getBatchesByProduct(
        productId
      );
      setBatches(batchesData);
      setError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load batches";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    if (selectedProductId) {
      await loadBatchesForProduct(selectedProductId);
    }
  };

  const handleAddBatch = () => {
    if (!selectedProductId) {
      return;
    }
    setEditingBatch(null);
    setShowModal(true);
  };

  const handleEditBatch = (batch: ProductBatch) => {
    setEditingBatch(batch);
    setShowModal(true);
  };

  const handleDeleteBatch = async (productId: string, invoiceNo: string) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) {
      return;
    }

    try {
      await productBatchService.deleteBatch(productId, invoiceNo);
      await loadData();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete batch";
      setError(message);
    }
  };

  const getProductKey = (product: Product & { productId?: string }) =>
    product.id || product.productId || "";

  const getProductName = (productId: string) => {
    const product = products.find((p) => getProductKey(p) === productId);
    return product ? product.name : productId;
  };

  const handleProductSelect = (value: string) => {
    setSelectedProductId(value);
    setBatchSearchTerm("");
    setSearchParams(value ? { productId: value } : {});
    if (value) {
      loadBatchesForProduct(value);
    } else {
      setBatches([]);
    }
  };

  const filteredProducts = (() => {
    const term = productSearchTerm.toLowerCase();
    const list = products.filter((product) =>
      getProductKey(product).toLowerCase().includes(term)
    );
    if (
      selectedProductId &&
      !list.some((p) => getProductKey(p) === selectedProductId)
    ) {
      const selectedProduct = products.find(
        (p) => getProductKey(p) === selectedProductId
      );
      if (selectedProduct) {
        return [selectedProduct, ...list];
      }
    }
    return list;
  })();

  const filteredBatches = batches.filter((batch) => {
    if (!selectedProductId) {
      return false;
    }
    const term = batchSearchTerm.toLowerCase();
    const matchesSearch =
      batch.productId.toLowerCase().includes(term) ||
      getProductName(batch.productId).toLowerCase().includes(term) ||
      batch.invoiceNo.toLowerCase().includes(term);
    const matchesSelected = batch.productId === selectedProductId;
    return matchesSearch && matchesSelected;
  });

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Product Batch Management</h1>
        </div>

        <div className="content-wrapper">
          <div
            className="toolbar"
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <div style={{ width: "100%" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                Search product by ID
              </label>
              <input
                type="text"
                placeholder="Type a product ID..."
                value={productSearchTerm}
                onChange={(e) => setProductSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div style={{ width: "100%" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                Select product
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              >
                <option value="">Choose a product</option>
                {filteredProducts.map((product) => {
                  const pid = getProductKey(product);
                  if (!pid) {
                    return null;
                  }
                  return (
                    <option key={pid} value={pid}>
                      {pid} — {product.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {selectedProductId ? (
            <>
              <div className="toolbar">
                <input
                  type="text"
                  placeholder="Search batches..."
                  value={batchSearchTerm}
                  onChange={(e) => setBatchSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div
                  style={{
                    marginLeft: "12px",
                    fontSize: "12px",
                    color: "#555",
                  }}
                >
                  Viewing batches for: <strong>{selectedProductId}</strong>
                </div>
                <button onClick={handleAddBatch} className="btn btn-primary">
                  Add Batch
                </button>
              </div>
            </>
          ) : (
            <div className="no-data" style={{ marginTop: "16px" }}>
              Select a product to see available batches and add new ones.
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading batches...</div>
          ) : selectedProductId ? (
            <div className="table-container">
              {filteredBatches.length === 0 ? (
                <p className="no-data">No batches found</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Batch No</th>
                      <th>Product</th>
                      <th>Invoice No</th>
                      <th>Quantity</th>
                      <th>Unit Cost</th>
                      <th>Unit Price</th>
                      <th>Expiry Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches.map((batch) => (
                      <tr key={`${batch.productId}-${batch.invoiceNo}`}>
                        <td>{batch.batchNo}</td>
                        <td>{getProductName(batch.productId)}</td>
                        <td>{batch.invoiceNo}</td>
                        <td>{batch.qty}</td>
                        <td>${batch.unitCost.toFixed(2)}</td>
                        <td>${batch.unitPrice.toFixed(2)}</td>
                        <td>
                          {batch.exp
                            ? new Date(batch.exp).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleEditBatch(batch)}
                              className="btn btn-small btn-secondary"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteBatch(
                                  batch.productId,
                                  batch.invoiceNo
                                )
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
              )}
            </div>
          ) : null}
        </div>

        {showModal && (
          <ProductBatchModal
            batch={editingBatch}
            products={products}
            invoices={invoices}
            selectedProductId={selectedProductId}
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

export default ProductBatches;
