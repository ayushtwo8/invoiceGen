import type { Invoice, InvoiceStats } from "../types";
import api from "./api";

export const invoiceService = {
  createInvoice: async (data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.post("/invoices", data);
    return response.data;
  },
  getInvoices: async (status?: string, search?: string): Promise<Invoice[]> => {
    const params: any = {};
    if (status) params.status = status;
    if (search) params.search = search;

    const response = await api.get("/invoices", { params });
    return response.data;
  },
  updateInvoice: async (
    id: string,
    data: Partial<Invoice>
  ): Promise<Invoice> => {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/invoices/${id}`);
  },

  getStats: async (): Promise<InvoiceStats> => {
    const response = await api.get("/invoices/stats");
    return response.data;
  },
};
