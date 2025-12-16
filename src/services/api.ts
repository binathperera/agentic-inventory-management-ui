import axios from "axios";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  User,
  ProductBatch,
  ProductBatchCreateRequest,
  ProductBatchUpdateRequest,
  Invoice,
  InvoiceCreateRequest,
  InvoiceUpdateRequest,
  Supplier,
  SupplierCreateRequest,
  SupplierUpdateRequest,
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TransactionItem,
  TransactionItemCreateRequest,
  TransactionItemUpdateRequest,
} from "../types";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data on 401 errors
      // The app will redirect to login through the AuthContext
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Product APIs
export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (product: ProductCreateRequest): Promise<Product> => {
    const response = await api.post<Product>("/products", product);
    return response.data;
  },

  updateProduct: async (
    id: number,
    product: ProductUpdateRequest
  ): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// User APIs
export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, user: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  deleteUser: async (username: string): Promise<void> => {
    await api.delete(`/users/${username}`);
  },
};

// Supplier APIs
export const supplierService = {
  getAllSuppliers: async (): Promise<Supplier[]> => {
    const response = await api.get<Supplier[]>("/suppliers");
    return response.data;
  },

  getSupplierById: async (supplierId: string): Promise<Supplier> => {
    const response = await api.get<Supplier>(`/suppliers/${supplierId}`);
    return response.data;
  },

  createSupplier: async (supplier: SupplierCreateRequest): Promise<Supplier> => {
    const response = await api.post<Supplier>("/suppliers", supplier);
    return response.data;
  },

  updateSupplier: async (supplierId: string, supplier: SupplierUpdateRequest): Promise<Supplier> => {
    const response = await api.put<Supplier>(`/suppliers/${supplierId}`, supplier);
    return response.data;
  },

  deleteSupplier: async (supplierId: string): Promise<void> => {
    await api.delete(`/suppliers/${supplierId}`);
  },
};

// Invoice APIs
export const invoiceService = {
  getAllInvoices: async (): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>("/invoices");
    return response.data;
  },

  getInvoiceById: async (invoiceNo: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${invoiceNo}`);
    return response.data;
  },

  createInvoice: async (invoice: InvoiceCreateRequest): Promise<Invoice> => {
    const response = await api.post<Invoice>("/invoices", invoice);
    return response.data;
  },

  updateInvoice: async (invoiceNo: string, invoice: InvoiceUpdateRequest): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/invoices/${invoiceNo}`, invoice);
    return response.data;
  },

  deleteInvoice: async (invoiceNo: string): Promise<void> => {
    await api.delete(`/invoices/${invoiceNo}`);
  },
};

// ProductBatch APIs
export const productBatchService = {
  getAllProductBatches: async (): Promise<ProductBatch[]> => {
    const response = await api.get<ProductBatch[]>("/product-batches");
    return response.data;
  },

  getProductBatchById: async (productId: string, invoiceNo: string): Promise<ProductBatch> => {
    const response = await api.get<ProductBatch>(`/product-batches/${productId}/${invoiceNo}`);
    return response.data;
  },

  createProductBatch: async (batch: ProductBatchCreateRequest): Promise<ProductBatch> => {
    const response = await api.post<ProductBatch>("/product-batches", batch);
    return response.data;
  },

  updateProductBatch: async (productId: string, invoiceNo: string, batch: ProductBatchUpdateRequest): Promise<ProductBatch> => {
    const response = await api.put<ProductBatch>(`/product-batches/${productId}/${invoiceNo}`, batch);
    return response.data;
  },

  deleteProductBatch: async (productId: string, invoiceNo: string): Promise<void> => {
    await api.delete(`/product-batches/${productId}/${invoiceNo}`);
  },
};

// Transaction APIs
export const transactionService = {
  getAllTransactions: async (): Promise<Transaction[]> => {
    const response = await api.get<Transaction[]>("/transactions");
    return response.data;
  },

  getTransactionById: async (transactionId: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${transactionId}`);
    return response.data;
  },

  createTransaction: async (transaction: TransactionCreateRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>("/transactions", transaction);
    return response.data;
  },

  updateTransaction: async (transactionId: string, transaction: TransactionUpdateRequest): Promise<Transaction> => {
    const response = await api.put<Transaction>(`/transactions/${transactionId}`, transaction);
    return response.data;
  },

  deleteTransaction: async (transactionId: string): Promise<void> => {
    await api.delete(`/transactions/${transactionId}`);
  },
};

// TransactionItem APIs
export const transactionItemService = {
  getAllTransactionItems: async (transactionId: string): Promise<TransactionItem[]> => {
    const response = await api.get<TransactionItem[]>(`/transactions/${transactionId}/items`);
    return response.data;
  },

  getTransactionItemById: async (transactionId: string, productId: string): Promise<TransactionItem> => {
    const response = await api.get<TransactionItem>(`/transactions/${transactionId}/items/${productId}`);
    return response.data;
  },

  createTransactionItem: async (item: TransactionItemCreateRequest): Promise<TransactionItem> => {
    const response = await api.post<TransactionItem>(`/transactions/${item.transactionId}/items`, item);
    return response.data;
  },

  updateTransactionItem: async (transactionId: string, productId: string, item: TransactionItemUpdateRequest): Promise<TransactionItem> => {
    const response = await api.put<TransactionItem>(`/transactions/${transactionId}/items/${productId}`, item);
    return response.data;
  },

  deleteTransactionItem: async (transactionId: string, productId: string): Promise<void> => {
    await api.delete(`/transactions/${transactionId}/items/${productId}`);
  },
};

export default api;
