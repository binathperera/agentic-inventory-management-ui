import type { Supplier } from "../types";

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

const SupplierTable = ({ suppliers, onEdit, onDelete }: SupplierTableProps) => {
  return (
    <div className="table-container">
      {suppliers.length === 0 ? (
        <p className="no-data">No suppliers found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.name}</td>
                <td>{supplier.email || "-"}</td>
                <td>{supplier.contact || "-"}</td>
                <td>{supplier.address || "-"}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onEdit(supplier)}
                      className="btn btn-small btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(supplier.id)}
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
  );
};

export default SupplierTable;
