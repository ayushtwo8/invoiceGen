import type { AuthResponse, User } from "../types";
import api from "./api";

export const authService = {
    register: async(name: string, email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', { name, email, password});
        return response.data;
    },

    login: async(email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', { email, password});
        return response.data;
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    updateProfile: async (data: Partial<User>): Promise<User> => {
        const response = await api.put('/auth/profile', data);
        return response.data;
    }
}