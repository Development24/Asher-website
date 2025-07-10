import { api } from "@/lib/config/api";

export interface CreatePaymentInterface {
    paymentGateway: string;
    payment_method_types?: string;
    payment_method?: string;
    amount: number;
    currency?: string;
}

// Response types
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  [key: string]: any;
}

export interface CreatePaymentResponse {
  message: string;
  payment: Payment;
}

export interface VerifyPaymentResponse {
  message: string;
  payment: Payment;
}

export interface Wallet {
  id: string;
  balance: number;
  currency: string;
  [key: string]: any;
}

export interface GetUserWalletResponse {
  wallet: Wallet;
  message?: string;
}

export interface GetUserWalletsResponse {
  wallets: Wallet[];
  message?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  createdAt: string;
  [key: string]: any;
}

export interface GetUserTransactionsResponse {
  transactions: Transaction[];
  message?: string;
}

export interface Bill {
  id: string;
  billName: string;
  amount: number;
  dueDate: string;
  [key: string]: any;
}

export interface CreateBillResponse {
  message: string;
  bill: Bill;
}

export interface GetAllBillsResponse {
  bills: Bill[];
  message?: string;
}

export interface GetPropertyBillsResponse {
  bills: Bill[];
  message?: string;
}

export interface GetBillByIdResponse {
  bill: Bill;
  message?: string;
}

export interface UpdateBillResponse {
  message: string;
  bill: Bill;
}

export interface DeleteBillResponse {
  message: string;
}

export interface GetLandlordTransactionsResponse {
  transactions: Transaction[];
  message?: string;
}

export const createPayment = async (data: CreatePaymentInterface): Promise<CreatePaymentResponse> => {
    const response = await api.post("api/wallet/fund", data);
    return response.data;
};

export const verifyPayment = async (id: string, data: { paymentGateway: string }): Promise<VerifyPaymentResponse> => {
    const response = await api.post(`api/wallet/fund-verify/${id}`, data);
    return response.data;
};

export const getUserWallet = async (locationCurrency: string): Promise<GetUserWalletResponse> => {
    const response = await api.get(`api/wallet/?locationCurrency=${locationCurrency}`);
    return response.data;
};

export const getUserWallets = async (): Promise<GetUserWalletsResponse> => {
    const response = await api.get(`api/wallet/`);
    return response.data;
};

export const getUserTransactions = async (): Promise<GetUserTransactionsResponse> => {
    const response = await api.get(`api/transactions/all`);
    return response.data;
};

// LANDLORD BILL MANAGEMENT ENDPOINTS (From Postman Collection)
export interface CreateBillInterface {
    billName: string;
    billCategory: string;
    description: string;
    amount: number;
    billFrequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONE_TIME';
    dueDate: string;
    payableBy: 'LANDLORD' | 'TENANT';
    propertyId: string;
}

export interface UpdateBillInterface {
    amount?: number;
    billFrequency?: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONE_TIME';
    dueDate?: string;
    payableBy?: 'LANDLORD' | 'TENANT';
}

export const createBill = async (data: CreateBillInterface): Promise<CreateBillResponse> => {
    const response = await api.post("api/landlord/bills", data);
    return response.data;
};

export const getAllBills = async (): Promise<GetAllBillsResponse> => {
    const response = await api.get("api/landlord/bills/list");
    return response.data;
};

export const getPropertyBills = async (propertyId: string): Promise<GetPropertyBillsResponse> => {
    const response = await api.get(`api/landlord/bills/properties/${propertyId}`);
    return response.data;
};

export const getBillById = async (billId: string): Promise<GetBillByIdResponse> => {
    const response = await api.get(`api/landlord/bills/${billId}`);
    return response.data;
};

export const updateBill = async (billId: string, data: UpdateBillInterface): Promise<UpdateBillResponse> => {
    const response = await api.patch(`api/landlord/bills/${billId}`, data);
    return response.data;
};

export const deleteBill = async (billId: string): Promise<DeleteBillResponse> => {
    const response = await api.delete(`api/landlord/bills/${billId}`);
    return response.data;
};

// LANDLORD TRANSACTION ENDPOINTS
export const getLandlordTransactions = async (propertyId: string): Promise<GetLandlordTransactionsResponse> => {
    const response = await api.get(`api/landlord/transactions/${propertyId}`);
    return response.data;
};