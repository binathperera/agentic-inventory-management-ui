import { useState, useEffect } from "react";
import { supplierService } from "../services/api";
import type { Supplier } from "../types";
import Navigation from "../components/Navigation";
import SupplierModal from "../components/SupplierModal";
import SupplierTable from "../components/SupplierTable";
import "../styles/Suppliers.css";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const result = await supplierService.getAllSuppliers();
      console.log("Fetched suppliers:", result);
      setSuppliers(result);
      setError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load suppliers";
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

  const handleDeleteSupplier = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) {
      return;
    }

    try {
      await supplierService.deleteSupplier(id);
      await loadSuppliers();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete supplier";
      setError(message);
    }
  };

  // const filteredSuppliers = suppliers.filter(
  //   (supplier) =>
  //     (supplier.name &&
  //       supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //     (supplier.email &&
  //       supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //     (supplier.contact &&
  //       supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()))
  // );

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supplier.email &&
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.contact &&
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "email") return (a.email || "").localeCompare(b.email || "");

    return 0;
  });

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Supplier Management</h1>
          <p className="subtitle">
            Manage your suppliers and their information
          </p>
        </div>

        {/* Supplier Statistics */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <div className="stat-label">Total Suppliers</div>
              <div className="stat-value">{suppliers.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✉️</div>
            <div className="stat-content">
              <div className="stat-label">Verified Contacts</div>
              <div className="stat-value">
                {suppliers.filter((s) => s.email).length}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📞</div>
            <div className="stat-content">
              <div className="stat-label">With Phone</div>
              <div className="stat-value">
                {suppliers.filter((s) => s.contact).length}
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <div className="stat-label">Locations</div>
              <div className="stat-value">
                {
                  [...new Set(suppliers.map((s) => s.address).filter(Boolean))]
                    .length
                }
              </div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="toolbar">
            <div className="toolbar-section">
              <input
                type="text"
                placeholder="Search by name, email, or contact..."
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
                <option value="email">Sort by Email</option>
              </select>
            </div>

            <button onClick={handleAddSupplier} className="btn btn-primary">
              + Add Supplier
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading suppliers...</div>
          ) : sortedSuppliers.length === 0 ? (
            <div className="no-data">
              <p>No suppliers found</p>
              <button onClick={handleAddSupplier} className="btn btn-primary">
                Create First Supplier
              </button>
            </div>
          ) : (
            <SupplierTable
              suppliers={sortedSuppliers}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
            />
          )}
        </div>

        {showModal && (
          <SupplierModal
            supplier={editingSupplier}
            onSave={async () => {
              setShowModal(false);
              await loadSuppliers();
            }}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Suppliers;
