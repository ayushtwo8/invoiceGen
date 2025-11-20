import { create } from 'zustand';
import type { Client } from '../types';

interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  loading: boolean;
  setClients: (clients: Client[]) => void;
  setCurrentClient: (client: Client | null) => void;
  setLoading: (loading: boolean) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  removeClient: (id: string) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  clients: [],
  currentClient: null,
  loading: false,
  setClients: (clients) => set({ clients }),
  setCurrentClient: (client) => set({ currentClient: client }),
  setLoading: (loading) => set({ loading }),
  addClient: (client) => set((state) => ({ clients: [client, ...state.clients] })),
  updateClient: (client) =>
    set((state) => ({
      clients: state.clients.map((c) => (c._id === client._id ? client : c)),
    })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c._id !== id),
    })),
}));