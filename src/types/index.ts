export interface User {
  type: string;
  username: string;
  email: string;
  roles: string[];
  errorMessage?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  roles: string[];
}

// Product - (tenant_id, product_id), name, latest_batch_no, remaining_qty, latest_unit_price, created_at, updated_at, schema_version
export interface Product {
  tenantId?: string;
  productId: string;
  name: string;
  latestBatchNo?: string;
  remainingQty: number;
  latestUnitPrice: number;
  createdAt?: string;
  updatedAt?: string;
  schemaVersion?: number;
  // Keeping old fields for backward compatibility
  id?: number;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
}

export interface ProductCreateRequest {
  name: string;
  latestBatchNo?: string;
  remainingQty: number;
  latestUnitPrice: number;
  // Keeping old fields for backward compatibility
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
}

export interface ProductUpdateRequest {
  productId: string;
  name: string;
  latestBatchNo?: string;
  remainingQty: number;
  latestUnitPrice: number;
  // Keeping old fields for backward compatibility
  id?: number;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
}

// ProductBatch - (tenant_id, product_id, invoice_no), batch_no, qty, unit_cost, unit_price, exp, created_at, updated_at, schema_version
export interface ProductBatch {
  tenantId?: string;
  productId: string;
  invoiceNo: string;
  batchNo: string;
  qty: number;
  unitCost: number;
  unitPrice: number;
  exp?: string;
  createdAt?: string;
  updatedAt?: string;
  schemaVersion?: number;
}

export interface ProductBatchCreateRequest {
  productId: string;
  invoiceNo: string;
  batchNo: string;
  qty: number;
  unitCost: number;
  unitPrice: number;
  exp?: string;
}

export interface ProductBatchUpdateRequest {
  productId: string;
  invoiceNo: string;
  batchNo: string;
  qty: number;
  unitCost: number;
  unitPrice: number;
  exp?: string;
}

// Invoice - (tenant_id, invoice_no, supplier_id), date, created_at, updated_at, schema_version
export interface Invoice {
  tenantId?: string;
  invoiceNo: string;
  supplierId: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  schemaVersion?: number;
}

export interface InvoiceCreateRequest {
  invoiceNo: string;
  supplierId: string;
  date: string;
}

export interface InvoiceUpdateRequest {
  invoiceNo: string;
  supplierId: string;
  date: string;
}

// Supplier - (tenant_id, supplier_id), name, email, address, contact, created_at, updated_at, schema_version
export interface Supplier {
  tenantId?: string;
  supplierId: string;
  name: string;
  email: string;
  address: string;
  contact: string;
  createdAt?: string;
  updatedAt?: string;
  schemaVersion?: number;
}

export interface SupplierCreateRequest {
  supplierId: string;
  name: string;
  email: string;
  address: string;
  contact: string;
}

export interface SupplierUpdateRequest {
  supplierId: string;
  name: string;
  email: string;
  address: string;
  contact: string;
}

// Transaction - (tenant_id, transaction_id), payment_method, gross_amount, discount_amount, net_amount, paid_amount, balance_amount, created_at, updated_at, schema_version
export interface Transaction {
  tenantId?: string;
  transactionId: string;
  paymentMethod: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  createdAt?: string;
  updatedAt?: string;
  schemaVersion?: number;
}

export interface TransactionCreateRequest {
  transactionId: string;
  paymentMethod: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
}

export interface TransactionUpdateRequest {
  transactionId: string;
  paymentMethod: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
}

// TransactionItem - (tenant_id, transaction_id, product_id), qty, unit_price, created_at, updated_at, schema_version
export interface TransactionItem {
  tenantId?: string;
  transactionId: string;
  productId: string;
  qty: number;
  unitPrice: number;
  createdAt?: string;
  updatedAt?: string;
  schemaVersion?: number;
}

export interface TransactionItemCreateRequest {
  transactionId: string;
  productId: string;
  qty: number;
  unitPrice: number;
}

export interface TransactionItemUpdateRequest {
  transactionId: string;
  productId: string;
  qty: number;
  unitPrice: number;
}
