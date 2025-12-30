import type { Product } from '../types';

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
              <th>Name</th>
              <th>SKU</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Supplier</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.description || '-'}</td>
                <td>₹{product.price?.toFixed(2) || '-'}</td>
                <td>{product.quantity || 0}</td>
                <td>{product.category || '-'}</td>
                <td>{product.supplier || '-'}</td>
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
