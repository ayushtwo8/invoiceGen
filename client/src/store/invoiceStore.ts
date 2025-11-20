import { create } from 'zustand'
import type { Invoice, InvoiceStats } from "../types";

interface InvoiceState {
    invoices: Invoice[];
    currentInvoice: Invoice | null;
    stats: InvoiceStats | null;
    loading: boolean,
    setInvoices: (invoices: Invoice[]) => void;
    setCurrentInvoice: (invoice: Invoice | null) => void;
    setStats: (stats: InvoiceStats) => void;
    setLoading: (loading: boolean) => void;
    addInvoice: (invoice: Invoice) => void;
    updateInvoice: (invoice: Invoice) => void;
    removeInvoice: (id: string) => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
    invoices: [],
    currentInvoice: null,
    stats: null,
    loading: false,
    setInvoices: (invoices) => set({ invoices }),
    setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ loading }),
    addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
    updateInvoice: (invoice) =>
        set((state) => ({
        invoices: state.invoices.map((inv) => (inv._id === invoice._id ? invoice : inv)),
        })),
    removeInvoice: (id) =>
        set((state) => ({
        invoices: state.invoices.filter((inv) => inv._id !== id),
        })),
}));