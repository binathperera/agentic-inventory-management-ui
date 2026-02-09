import axios from "axios";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  User,
  Role,
  Supplier,
  SupplierCreateRequest,
  SupplierUpdateRequest,
  Invoice,
  InvoiceCreateRequest,
  InvoiceUpdateRequest,
  ProductBatch,
  ProductBatchCreateRequest,
  ProductBatchUpdateRequest,
  Transaction,
  TransactionCreateRequest,
  TransactionUpdateRequest,
  TenantConfig,
  AiChatDocument,
} from "../types";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// FIXED Request interceptor - Adds JWT + TENANT ID
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("[API] Token found, Authorization header set");
      
      try {
        const base64Url = token.split('.')[1];
        if (base64Url) {
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          
          if (decoded.tenantId) {
            config.headers['X-Tenant-Id'] = decoded.tenantId;
            console.log("[API] ✅ Added tenantId:", decoded.tenantId);
          }
          
          console.log("[API] Token payload - Roles:", decoded.roles, "TenantId:", decoded.tenantId);
        }
      } catch {
        console.log("[API] Could not decode token");
      }
    } else {
      console.log("[API] No token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("[API] 401 Unauthorized - clearing auth");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    console.error("[API] Error occurred:");
    console.error("  URL:", error.config?.url);
    console.error("  Method:", error.config?.method);
    console.error("  Status:", error.response?.status);
    console.error("  Status Text:", error.response?.statusText);
    console.error("  Response Data:", error.response?.data);
    console.error("  Tenant-Id:", error.config?.headers?.['X-Tenant-Id']);
    console.error("  Auth Header:", error.config?.headers?.Authorization);
    
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

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (product: ProductCreateRequest): Promise<Product> => {
    const response = await api.post<Product>("/products", product);
    return response.data;
  },

  updateProduct: async (
    id: string,
    product: ProductUpdateRequest
  ): Promise<Product> => {
    console.log("Updating product:", id, product);
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

// User APIs
export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, user: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, user);
    return response.data;
  },

  updateUserRoles: async (id: string, roles: Role[]): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, { roles });
    return response.data;
  },

  assignRole: async (userId: string, roleId: string): Promise<User> => {
    const response = await api.post<User>(`/users/${userId}/roles/${roleId}`, {});
    return response.data;
  },

  removeRole: async (userId: string, roleId: string): Promise<User> => {
    const response = await api.delete<User>(`/users/${userId}/roles/${roleId}`);
    return response.data;
  },

  enableUser: async (id: string): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, { enabled: true });
    return response.data;
  },

  disableUser: async (id: string): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, { enabled: false });
    return response.data;
  },

  promoteUser: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/promote`);
  },
  
  demoteUser: async (id: string): Promise<void> => {
    await api.post(`/users/${id}/demote`);
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Role APIs
export const roleService = {
  getAllRoles: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>("/roles");
    return response.data;
  },

  getRoleById: async (id: string): Promise<Role> => {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
  },
};

// Supplier APIs
export const supplierService = {
  getAllSuppliers: async (): Promise<Supplier[]> => {
    try {
      console.log("[SupplierService] Fetching all suppliers...");
      const response = await api.get<Supplier[]>("/suppliers");
      console.log("[SupplierService] Successfully fetched suppliers:", response.data.length);
      return response.data;
    } catch (error) {
      console.error("[SupplierService] Error fetching suppliers:", error);
      throw error;
    }
  },

  getSupplierById: async (id: string): Promise<Supplier> => {
    const response = await api.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  createSupplier: async (
    supplier: SupplierCreateRequest
  ): Promise<Supplier> => {
    const response = await api.post<Supplier>("/suppliers", supplier);
    return response.data;
  },

  updateSupplier: async (
    id: string,
    supplier: SupplierUpdateRequest
  ): Promise<Supplier> => {
    const response = await api.put<Supplier>(`/suppliers/${id}`, supplier);
    return response.data;
  },

  deleteSupplier: async (id: string): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },
};

// Invoice APIs
export const invoiceService = {
  getAllInvoices: async (): Promise<Invoice[]> => {
    try {
      console.log("[InvoiceService] Fetching all invoices...");
      const response = await api.get<Invoice[]>("/invoices");
      console.log("[InvoiceService] Successfully fetched invoices:", response.data.length);
      return response.data;
    } catch (error) {
      console.error("[InvoiceService] Error fetching invoices:", error);
      throw error;
    }
  },

  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (invoice: InvoiceCreateRequest): Promise<Invoice> => {
    const response = await api.post<Invoice>("/invoices", invoice);
    return response.data;
  },

  updateInvoice: async (
    id: string,
    invoice: InvoiceUpdateRequest
  ): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/invoices/${id}`, invoice);
    return response.data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/invoices/${id}`);
  },
};

// Product Batch APIs
export const productBatchService = {
  getAllBatches: async (): Promise<ProductBatch[]> => {
    const response = await api.get<ProductBatch[]>("/product-batches");
    return response.data;
  },

  getBatchesByProduct: async (productId: string): Promise<ProductBatch[]> => {
    const response = await api.get<ProductBatch[]>(
      `/product-batches/product/${productId}`
    );
    return response.data;
  },

  getBatchById: async (
    productId: string,
    invoiceNo: string
  ): Promise<ProductBatch> => {
    const response = await api.get<ProductBatch>(
      `/product-batches/${productId}/${invoiceNo}`
    );
    return response.data;
  },

  createBatch: async (
    batch: ProductBatchCreateRequest
  ): Promise<ProductBatch> => {
    const response = await api.post<ProductBatch>("/product-batches", batch);
    return response.data;
  },

  updateBatch: async (
    productId: string,
    invoiceNo: string,
    batch: ProductBatchUpdateRequest
  ): Promise<ProductBatch> => {
    const response = await api.put<ProductBatch>(
      `/product-batches/${productId}/${invoiceNo}`,
      batch
    );
    return response.data;
  },

  deleteBatch: async (productId: string, invoiceNo: string): Promise<void> => {
    await api.delete(`/product-batches/${productId}/${invoiceNo}`);
  },
};

// Transaction APIs
export const transactionService = {
  getAllTransactions: async (): Promise<Transaction[]> => {
    try {
      console.log("[TransactionService] Fetching all transactions...");
      const response = await api.get<Transaction[]>("/transactions");
      console.log("[TransactionService] Successfully fetched transactions:", response.data.length);
      return response.data;
    } catch (error) {
      console.error("[TransactionService] Error fetching transactions:", error);
      throw error;
    }
  },

  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (
    transaction: TransactionCreateRequest
  ): Promise<Transaction> => {
    const response = await api.post<Transaction>("/transactions", transaction);
    return response.data;
  },

  updateTransaction: async (
    id: string,
    transaction: TransactionUpdateRequest
  ): Promise<Transaction> => {
    const response = await api.put<Transaction>(
      `/transactions/${id}`,
      transaction
    );
    return response.data;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};

// Tenant Config APIs
export const tenantConfigService = {
  getTenantConfig: async (): Promise<TenantConfig> => {
    const response = await api.get<TenantConfig>("/tenant-config");
    return response.data;
  },

  updateTenantConfig: async (config: TenantConfig): Promise<TenantConfig> => {
    const response = await api.put<TenantConfig>("/tenant-config", config);
    return response.data;
  },

  initializeTenantConfig: async (): Promise<TenantConfig> => {
    const response = await api.post<TenantConfig>("/tenant-config/initialize");
    return response.data;
  },

  getConfigBySubDomain: async (subDomain: string): Promise<TenantConfig> => {
    const response = await api.get<TenantConfig>(
      `/tenant-config/by-subdomain/${subDomain}`
    );
    return response.data;
  },
};

// AI Chat APIs
export const aiChatService = {
  query: async (prompt: string): Promise<AiChatDocument[]> => {
    const response = await api.get<AiChatDocument[]>("/chat/query", {
      params: { prompt },
    });
    return response.data;
  },
};

export default api;
