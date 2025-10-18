import { db, auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
  Unsubscribe
} from 'firebase/auth';
import { Movie, WatchlistItem } from '../types';

class FirebaseService {
  async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signUp(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  async addToWatchlist(userId: string, movie: Movie): Promise<WatchlistItem> {
    try {
      const bookingData = {
        userId,
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        timestamp: new Date(),
        tickets: 1
      };

      const { collection, addDoc } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      return { id: docRef.id, ...bookingData } as WatchlistItem;
    } catch {
      throw new Error('Failed to add movie to watchlist. Please try again.');
    }
  }

  async getWatchlist(userId: string): Promise<WatchlistItem[]> {
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const q = query(collection(db, 'bookings'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      const watchlist: WatchlistItem[] = [];
      snapshot.forEach((doc) => {
        watchlist.push({ id: doc.id, ...doc.data() } as WatchlistItem);
      });

      return watchlist.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : (a.timestamp as any).seconds * 1000;
        const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : (b.timestamp as any).seconds * 1000;
        return bTime - aTime;
      });
    } catch {
      throw new Error('Failed to fetch watchlist. Please try again.');
    }
  }

  async removeFromWatchlist(bookingId: string): Promise<void> {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'bookings', bookingId));
    } catch {
      throw new Error('Failed to remove movie from watchlist. Please try again.');
    }
  }

  async isMovieInWatchlist(userId: string, movieId: number): Promise<boolean> {
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const q = query(
        collection(db, 'bookings'),
        where('userId', '==', userId),
        where('movieId', '==', movieId)
      );
      const snapshot = await getDocs(q);
      
      return !snapshot.empty;
    } catch (error) {
      console.error('Error checking watchlist:', error);
      return false;
    }
  }

  private getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };

    return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
  }

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): Unsubscribe {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser as FirebaseUser | null;
  }
}

export default new FirebaseService();