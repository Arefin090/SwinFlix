import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import firebaseService from '../services/firebaseService';

const user = ref(null);
const loading = ref(false);
const error = ref(null);

export function useAuth() {
  const router = useRouter();

  const clearError = () => {
    error.value = null;
  };

  const setLoading = (state) => {
    loading.value = state;
  };

  const handleError = (err) => {
    console.error('Auth error:', err);
    error.value = err.message || 'An unexpected error occurred';
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      clearError();
      
      const authUser = await firebaseService.signIn(email, password);
      user.value = authUser;
      
      return authUser;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      clearError();
      
      const authUser = await firebaseService.signUp(email, password);
      user.value = authUser;
      
      return authUser;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      clearError();
      
      await firebaseService.signOut();
      user.value = null;
      router.push('/');
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initializeAuth = () => {
    return firebaseService.onAuthStateChanged((authUser) => {
      user.value = authUser;
    });
  };

  return {
    // State
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Computed
    isAuthenticated: computed(() => !!user.value),
    userEmail: computed(() => user.value?.email || ''),
    userId: computed(() => user.value?.uid || ''),

    // Actions
    signIn,
    signUp,
    signOut,
    clearError,
    initializeAuth
  };
}

// Export the reactive user for compatibility with existing code
export { user };