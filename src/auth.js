import { supabase } from './supabase-client.js';

// Simple "Passwordless" Auth Service relying on LocalStorage
// In a real app, this would use Supabase Auth (GoTrue), but per requirements, 
// we are using a "Pick Profile" flow with trust-based local session.

const STORAGE_KEY_USER_ID = 'watchlist_current_user_id';
const STORAGE_KEY_USER_HANDLE = 'watchlist_current_user_handle';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.listeners = [];
    }

    async init() {
        const storedId = localStorage.getItem(STORAGE_KEY_USER_ID);
        if (storedId) {
            // Validate against DB
            const { data, error } = await supabase.from('users').select('*').eq('id', storedId).single();
            if (data && !error) {
                this.currentUser = data;
            } else {
                this.logout();
            }
        }
        return this.currentUser;
    }

    async login(handle) {
        const { data, error } = await supabase.from('users').select('*').eq('handle', handle).single();
        if (error || !data) {
            console.error('Login failed:', error);
            throw new Error('User not found');
        }

        this.currentUser = data;
        localStorage.setItem(STORAGE_KEY_USER_ID, data.id);
        localStorage.setItem(STORAGE_KEY_USER_HANDLE, data.handle);
        this.notifyListeners();
        return data;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem(STORAGE_KEY_USER_ID);
        localStorage.removeItem(STORAGE_KEY_USER_HANDLE);
        this.notifyListeners();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners() {
        this.listeners.forEach(l => l(this.currentUser));
    }
}

export const auth = new AuthService();
