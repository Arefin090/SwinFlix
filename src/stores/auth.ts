import { defineStore } from 'pinia';
import { User as FirebaseUser } from 'firebase/auth';
import firebaseService from '../services/firebaseService';
import { AuthState } from '../types';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email || '',
    userId: (state) => state.user?.uid || '',
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    authError: (state) => state.error
  },

  actions: {
    setUser(user: FirebaseUser | null): void {
      this.user = user;
    },

    setLoading(loading: boolean): void {
      this.loading = loading;
    },

    setError(error: string | null): void {
      this.error = error;
    },

    clearError(): void {
      this.error = null;
    },

    async signIn(email: string, password: string): Promise<FirebaseUser> {
      try {
        this.setLoading(true);
        this.clearError();
        
        const user = await firebaseService.signIn(email, password);
        this.setUser(user);
        
        return user;
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async signUp(email: string, password: string): Promise<FirebaseUser> {
      try {
        this.setLoading(true);
        this.clearError();
        
        const user = await firebaseService.signUp(email, password);
        this.setUser(user);
        
        return user;
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    async signOut(): Promise<void> {
      try {
        this.setLoading(true);
        this.clearError();
        
        await firebaseService.signOut();
        this.setUser(null);
      } catch (error: any) {
        this.setError(error.message);
        throw error;
      } finally {
        this.setLoading(false);
      }
    },

    initializeAuth() {
      return firebaseService.onAuthStateChanged((user: FirebaseUser | null) => {
        this.setUser(user);
      });
    }
  }
});