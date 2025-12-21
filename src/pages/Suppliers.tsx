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

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAllSuppliers();
      setSuppliers(data);
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

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      (supplier.name &&
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.email &&
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (supplier.contact &&
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-with-nav">
      <Navigation />
      <div className="page-content">
        <div className="page-header">
          <h1>Supplier Management</h1>
        </div>

        <div className="content-wrapper">
          <div className="toolbar">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleAddSupplier} className="btn btn-primary">
              Add Supplier
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {loading ? (
            <div className="loading">Loading suppliers...</div>
          ) : (
            <SupplierTable
              suppliers={filteredSuppliers}
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
