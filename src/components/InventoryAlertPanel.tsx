import type { Product, ProductBatch } from "../types";
import ProductTable from "./ProductTable";

interface InventoryAlertPanelProps {
  title: string;
  type: "batches" | "products";
  batches?: ProductBatch[];
  products?: Product[];
  productNames: Record<string, string>;
  onClose: () => void;
}

const InventoryAlertPanel = ({
  title,
  type,
  batches = [],
  products = [],
  productNames,
  onClose,
}: InventoryAlertPanelProps) => {
  return (
    <section className="inventory-alert-panel" aria-label={title}>
      <div className="inventory-alert-header">
        <div>
          <span className="inventory-alert-kicker">Inventory alert</span>
          <h2>{title}</h2>
        </div>
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label={`Close ${title}`}
        >
          ×
        </button>
      </div>

      {type === "products" ? (
        products.length > 0 ? (
          <ProductTable
            products={products}
            onEdit={() => undefined}
            onDelete={() => undefined}
            isAdmin={false}
          />
        ) : (
          <p className="inventory-alert-empty">No low stock products found.</p>
        )
      ) : batches.length > 0 ? (
        <div className="table-container inventory-alert-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Batch</th>
                <th>Invoice</th>
                <th>Expiry Date</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr
                  key={`${batch.productId}-${batch.invoiceNo}-${batch.batchNo}`}
                >
                  <td>{productNames[batch.productId] || batch.productId}</td>
                  <td className="sku-column">{batch.batchNo}</td>
                  <td className="sku-column">{batch.invoiceNo}</td>
                  <td>{new Date(batch.exp as string).toLocaleDateString()}</td>
                  <td className="quantity-column">{batch.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="inventory-alert-empty">
          No matching product batches found.
        </p>
      )}
    </section>
  );
};

export default InventoryAlertPanel;
