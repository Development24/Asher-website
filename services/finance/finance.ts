import { api } from "@/lib/config/api";

export interface CreatePaymentInterface {
    paymentGateway: string;
    payment_method_types?: string;
    payment_method?: string;
    amount: number;
    currency?: string;
}

export const createPayment = async (data: CreatePaymentInterface) => {
    const response = await api.post("api/wallet/fund", data);
    return response.data;
};

export const verifyPayment = async (id: string, data: { paymentGateway: string }) => {
    const response = await api.post(`api/wallet/fund-verify/${id}`, data);
    return response.data;
};

export const getUserWallet = async (locationCurrency: string) => {
    const response = await api.get(`api/wallet/?locationCurrency=${locationCurrency}`);
    return response.data;
};

export const getUserWallets = async () => {
    const response = await api.get(`api/wallet/`);
    return response.data;
};

export const getUserTransactions = async () => {
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

export const createBill = async (data: CreateBillInterface) => {
    const response = await api.post("api/landlord/bills", data);
    return response.data;
};

export const getAllBills = async () => {
    const response = await api.get("api/landlord/bills/list");
    return response.data;
};

export const getPropertyBills = async (propertyId: string) => {
    const response = await api.get(`api/landlord/bills/properties/${propertyId}`);
    return response.data;
};

export const getBillById = async (billId: string) => {
    const response = await api.get(`api/landlord/bills/${billId}`);
    return response.data;
};

export const updateBill = async (billId: string, data: UpdateBillInterface) => {
    const response = await api.patch(`api/landlord/bills/${billId}`, data);
    return response.data;
};

export const deleteBill = async (billId: string) => {
    const response = await api.delete(`api/landlord/bills/${billId}`);
    return response.data;
};

// LANDLORD TRANSACTION ENDPOINTS
export const getLandlordTransactions = async (propertyId: string) => {
    const response = await api.get(`api/landlord/transactions/${propertyId}`);
    return response.data;
};