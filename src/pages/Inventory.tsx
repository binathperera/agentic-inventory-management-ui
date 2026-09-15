import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { productBatchService, productService } from "../services/api";
import type { Product, ProductBatch } from "../types";
import Navigation from "../components/Navigation";
import InventoryAlertPanel from "../components/InventoryAlertPanel";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable.tsx";
import { AlertTriangle, CalendarClock, CalendarX } from "lucide-react";
import "../styles/Dashboard.css";

type InventoryAlert = "expiringSoon" | "expired" | "lowStock" | null;

const getExpiryTime = (expiry: string | undefined) => {
  if (!expiry) return null;
  const time = new Date(expiry).getTime();
  return Number.isNaN(time) ? null : time;
};

const Inventory = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState<InventoryAlert>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadProducts();
    loadBatches();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load products";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadBatches = async () => {
    try {
      setBatchesLoading(true);
      const data = await productBatchService.getAllBatches();
      setBatches(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load product batches";
      setError(message);
    } finally {
      setBatchesLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete product";
      setError(message);
    }
  };

  const handleSaveProduct = async (productData: {
    id?: string;
    name: string;
    latestBatchNo?: string;
    remainingQuantity?: number;
    criticalStockLevel?: number;
    latestUnitPrice?: number;
  }) => {
    try {
      if (editingProduct) {
        const updatePayload = {
          id: editingProduct.id,
          name: productData.name,
          latestBatchNo:
            productData.latestBatchNo || editingProduct.latestBatchNo,
          remainingQuantity:
            productData.remainingQuantity ?? editingProduct.remainingQuantity,
          criticalStockLevel:
            productData.criticalStockLevel ?? editingProduct.criticalStockLevel,
          latestUnitPrice:
            productData.latestUnitPrice ?? editingProduct.latestUnitPrice,
        };
        await productService.updateProduct(editingProduct.id, updatePayload);
      } else {
        if (!productData.id) {
          throw new Error("Product ID is required to create a product");
        }
        const createPayload = {
          id: productData.id,
          name: productData.name,
          latestBatchNo: productData.latestBatchNo || "BATCH-001",
          remainingQuantity: productData.remainingQuantity ?? 0,
          criticalStockLevel: productData.criticalStockLevel ?? 10,
          latestUnitPrice: productData.latestUnitPrice ?? 0,
        };
        await productService.createProduct(createPayload);
      }
      setShowModal(false);
      await loadProducts();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save product";
      throw new Error(message);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "quantity")
      return (b.remainingQuantity || 0) - (a.remainingQuantity || 0);
    if (sortBy === "price")
      return (b.latestUnitPrice || 0) - (a.latestUnitPrice || 0);
    return 0;
  });

  const now = Date.now();
  const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;
  const expiredBatches = batches.filter((batch) => {
    const expiryTime = getExpiryTime(batch.exp);
    return expiryTime !== null && expiryTime < now;
  });
  const expiringSoonBatches = batches.filter((batch) => {
    const expiryTime = getExpiryTime(batch.exp);
    return (
      expiryTime !== null && expiryTime >= now && expiryTime <= sevenDaysFromNow
    );
  });
  const expiringSoonCount = expiringSoonBatches.reduce(
    (total, batch) => total + batch.qty,
    0,
  );
  const expiredCount = expiredBatches.reduce(
    (total, batch) => total + batch.qty,
    0,
  );
  const lowStockCount = products.filter(
    (p) => (p.remainingQuantity || 0) < (p.criticalStockLevel ?? 10),
  ).length;
  const lowStockProducts = products.filter(
    (product) =>
      (product.remainingQuantity || 0) < (product.criticalStockLevel ?? 10),
  );
  const productNames = products.reduce<Record<string, string>>(
    (names, product) => {
      names[product.id] = product.name;
      return names;
    },
    {},
  );

  const showAlert = (nextAlert: InventoryAlert) => {
    if (batchesLoading && nextAlert !== "lowStock") return;
    setAlert(nextAlert);
  };

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Inventory Management</h1>
          <p className="subtitle">Track and manage your product inventory</p>
        </div>

        <div className="stats-container">
          <button
            type="button"
            className="stat-card stat-card-action"
            onClick={() => showAlert("expiringSoon")}
          >
            <div className="stat-icon">
              <CalendarClock size={32} color="#007c83" />
            </div>
            <div className="stat-content">
              <div className="stat-label">Expiring Soon</div>
              <div className="stat-value">{expiringSoonCount}</div>
            </div>
          </button>
          <button
            type="button"
            className="stat-card stat-card-action"
            onClick={() => showAlert("expired")}
          >
            <div className="stat-icon">
              <CalendarX size={32} color="#b42318" />
            </div>
            <div className="stat-content">
              <div className="stat-label">Expired Items</div>
              <div className="stat-value">{expiredCount}</div>
            </div>
          </button>
          <button
            type="button"
            className="stat-card stat-card-action"
            onClick={() => showAlert("lowStock")}
          >
            <div className="stat-icon">
              <AlertTriangle size={32} color="#ef4444" />
            </div>
            <div className="stat-content">
              <div className="stat-label">Low Stock Items</div>
              <div
                className="stat-value"
                style={{ color: lowStockCount > 0 ? "#dc3545" : "#28a745" }}
              >
                {lowStockCount}
              </div>
            </div>
          </button>
        </div>

        {alert === "expiringSoon" && (
          <InventoryAlertPanel
            title="Items expiring within 7 days"
            type="batches"
            batches={expiringSoonBatches}
            productNames={productNames}
            onClose={() => setAlert(null)}
          />
        )}
        {alert === "expired" && (
          <InventoryAlertPanel
            title="Expired product batches"
            type="batches"
            batches={expiredBatches}
            productNames={productNames}
            onClose={() => setAlert(null)}
          />
        )}
        {alert === "lowStock" && (
          <InventoryAlertPanel
            title="Low stock products"
            type="products"
            products={lowStockProducts}
            productNames={productNames}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="content-wrapper">
          <div className="toolbar">
            <div className="toolbar-section">
              <input
                type="text"
                placeholder="Search by product name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="toolbar-section">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="quantity">Sort by Quantity</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>

            {isAdmin() && (
              <button onClick={handleAddProduct} className="btn btn-primary">
                + Add Product
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading inventory...</div>
          ) : sortedProducts.length === 0 ? (
            <div className="no-data">
              <p>No products found</p>
              {isAdmin() && (
                <button onClick={handleAddProduct} className="btn btn-primary">
                  Create First Product
                </button>
              )}
            </div>
          ) : (
            <ProductTable
              products={sortedProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              isAdmin={isAdmin() ?? false}
            />
          )}
        </div>

        {showModal && (
          <ProductModal
            product={editingProduct}
            onSave={handleSaveProduct}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Inventory;
