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
  errorMessage?: string;
}

// Product types matching new schema
export type Product = {
  id: string;
  name: string;
  latestBatchNo: string;
  remainingQuantity?: number;
  latestUnitPrice: number;
};

export interface ProductCreateRequest {
  id: string;
  name: string;
  remainingQuantity?: number;
  latestUnitPrice?: number;
}

export interface ProductUpdateRequest {
  id: string;
  name: string;
  remainingQuantity?: number;
  latestUnitPrice?: number;
}

// Supplier types
export interface Supplier {
  id: string;
  name: string;
  email?: string;
  address?: string;
  contact?: string;
}

export interface SupplierCreateRequest {
  name: string;
  email?: string;
  address?: string;
  contact?: string;
}

export interface SupplierUpdateRequest {
  id: string;
  name: string;
  email?: string;
  address?: string;
  contact?: string;
}

// Invoice types
export interface Invoice {
  invoiceNo: string;
  id: string;
  date: string;
  supplierId: string;
}

export interface InvoiceCreateRequest {
  invoiceNo: string;
  supplierId: string;
  date: string;
}

export interface InvoiceUpdateRequest {
  id: string;
  invoiceNo: string;
  supplierId: string;
  date: string;
}

// Product Batch types
export interface ProductBatch {
  id: string;
  productId: string;
  invoiceNo: string;
  batchNo: string;
  qty: number;
  unitCost: number;
  unitPrice: number;
  exp?: string;
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

// Transaction types
export interface Transaction {
  id: string;
  transactionId: string;
  paymentMethod: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  createdAt: string;
  items?: TransactionItem[];
}

export interface TransactionCreateRequest {
  paymentMethod: string;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  balanceAmount: number;
  items: TransactionItemCreateRequest[];
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

// Transaction Item types
export interface TransactionItem {
  tenantId: string;
  transactionId: string;
  productId: string;
  qty: number;
  unitPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionItemCreateRequest {
  productId: string;
  qty: number;
  unitPrice: number;
}

// Tenant Config types
export interface TenantConfig {
  id?: string;
  brand?: Brand;
  uiTheme?: UiTheme;
  localization?: Localization;
  features?: Features;
}

// AI chat document response
export interface AiChatDocument {
  id?: string;
  title?: string;
  content?: string;
  score?: number;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Brand {
  name?: string;
  logoUrl?: string;
  faviconUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface UiTheme {
  mode?: string; // 'light', 'dark', 'auto'
  accentColor?: string;
  layoutStyle?: string; // 'compact', 'comfortable', 'spacious'
  cornerStyle?: string; // 'rounded', 'sharp', 'smooth'
}

export interface Localization {
  language?: string; // 'en', 'es', 'fr', etc.
  timezone?: string; // 'America/New_York', 'UTC', etc.
  currency?: string; // 'USD', 'EUR', 'GBP', etc.
  dateFormat?: string; // 'MM/DD/YYYY', 'DD/MM/YYYY', etc.
}

export interface Features {
  inventoryModule?: boolean;
  reportingModule?: boolean;
  supplierManagement?: boolean;
  advancedPricing?: boolean;
}
