import { useMutation, useQuery } from "@tanstack/react-query";
import { createPayment, CreatePaymentInterface, getUserTransactions, getUserWallet, getUserWallets, verifyPayment } from "./finance";

export const useCreatePayment = () => {
    return useMutation({
        mutationFn: (data: CreatePaymentInterface) => createPayment(data)
    });
};

export const useVerifyPayment = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: { paymentGateway: string } }) => verifyPayment(id, data)
    });
};

export const useGetUserWallet = (locationCurrency: string) => {
    return useQuery({
        queryKey: ["user-wallet", locationCurrency],
        queryFn: () => getUserWallet(locationCurrency),
        enabled: !!locationCurrency,
        retry: false
    });
};

export const useGetUserWallets = () => {
    return useQuery({
        queryKey: ["user-wallets"],
        queryFn: () => getUserWallets(),
        retry: false
    });
};

export const useGetUserTransactions = () => {
    return useQuery({
        queryKey: ["user-transactions"],
        queryFn: () => getUserTransactions(),
        retry: false
    });
};