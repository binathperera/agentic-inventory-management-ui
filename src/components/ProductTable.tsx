import type { Product } from "../types";
import { useNavigate } from "react-router-dom";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  isAdmin,
}: ProductTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      {products.length === 0 ? (
        <p className="no-data">No products found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>ID</th>
              <th>Latest Batch</th>
              <th>Unit Price</th>
              <th>Remaining Qty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isLowStock = (product.remainingQuantity || 0) < 10;

              return (
                <tr key={product.id}>
                  <td>
                    <div className="product-name">
                      <strong>{product.name}</strong>
                    </div>
                  </td>
                  <td className="sku-column">{product.id}</td>
                  <td className="sku-column">{product.latestBatchNo}</td>
                  <td className="price-column">
                    ${(product.latestUnitPrice || 0).toFixed(2)}
                  </td>
                  <td className="quantity-column">
                    <span className={isLowStock ? "low-stock" : "normal-stock"}>
                      {product.remainingQuantity || 0}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() =>
                          navigate(`/batches?productId=${product.id}`)
                        }
                        className="btn btn-small"
                        title="View product batches"
                      >
                        View Batches
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => onEdit(product)}
                            className="btn btn-small btn-secondary"
                            title="Edit product"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(product.id)}
                            className="btn btn-small btn-danger"
                            title="Delete product"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductTable;
