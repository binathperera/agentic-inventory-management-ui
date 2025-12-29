import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { productService } from "../services/api";
import type { Product } from "../types";
import Navigation from "../components/Navigation";
import ProductModal from "../components/ProductModal";
import ProductTable from "../components/ProductTable.tsx";
import "../styles/Dashboard.css";

const Inventory = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadProducts();
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
          remainingQuantity: productData.remainingQuantity || 0,
          latestUnitPrice: productData.latestUnitPrice || 0,
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

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) => sum + (p.latestUnitPrice || 0) * (p.remainingQuantity || 0),
    0
  );
  const lowStockCount = products.filter(
    (p) => (p.remainingQuantity || 0) < 10
  ).length;

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Inventory Management</h1>
          <p className="subtitle">Track and manage your product inventory</p>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-label">Total Products</div>
              <div className="stat-value">{totalProducts}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Total Inventory Value</div>
              <div className="stat-value">${totalValue.toFixed(2)}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-label">Low Stock Items</div>
              <div
                className="stat-value"
                style={{ color: lowStockCount > 0 ? "#dc3545" : "#28a745" }}
              >
                {lowStockCount}
              </div>
            </div>
          </div>
        </div>

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
