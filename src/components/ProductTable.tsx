import type { Product } from '../types';


interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const ProductTable = ({ products, onEdit, onDelete}: ProductTableProps) => {
  return (
    <div className="table-container">
      {products.length === 0 ? (
        <p className="no-data">No products found</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Latest Batch No.</th>
              <th>Remaining qty.</th>
              <th>Unit Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.name}</td>
                <td>{product.remainingQty?.toFixed(2)}</td>
                <td>{product.remainingQty?.toFixed(2)}</td>
                <td>₹{product.latestUnitPrice?.toFixed(2)}</td>
                <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onEdit(product)}
                        className="btn btn-small btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.productId)}
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

export default ProductTable;
