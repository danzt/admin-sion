import { create } from 'zustand';
import { db } from '../../services/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore/lite';
import {
  User,
  UserRole,
  UserStatus,
  ParamsUserCredentials,
} from '../../domain/user';
import { Store } from '../../domain/store';
import { formatDate } from '../../core/utils/FormattedDate';
import { auth } from '../../services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

const useStore = create<Store>((set) => ({
  user: null,
  users: [],
  loading: false,
  error: null,

  setUser: async (user: User) => {
    set({ user });
    return Promise.resolve();
  },

  addUser: async (record: User) => {
    try {
      const usersCollection = collection(db, 'users');
      const docRef = await addDoc(usersCollection, record);

      set((state) => ({
        users: [...state.users, { ...record, id: docRef.id }],
      }));
    } catch (error) {
      console.error('Error al crear el registro:', error);
      set({ error: 'Error al obtener los usuarios', loading: false });
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      const users: User[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          lastName: data.lastName,
          displayName: data.displayName,
          email: data.email,
          phone: data.phone || null,
          avatar: data.avatar || null,
          address: data.address || null,
          role: data.role as UserRole,
          status: data.status as UserStatus,
          createdAt: formatDate(data.createdAt),
          updatedAt: formatDate(data.updatedAt),
          createdBy: data.createdBy || '',
          updatedBy: data.updatedBy || '',
        };
      });

      set({ users, loading: false, error: null });
    } catch (error) {
      console.error('Error al obtener el registro:', error);
      set({ loading: false, error: 'Error al obtener el registro.' });
      throw error;
    }
  },

  createUser: async (params: ParamsUserCredentials) => {
    const user = await createUserWithEmailAndPassword(
      auth,
      params.email,
      params.password
    );
    useStore.getState().setUser(user as never);
  },

  doSignInWithEmailAndPassword: async (params: ParamsUserCredentials) => {
    await signInWithEmailAndPassword(auth, params.email, params.password);
  },

  doSendPasswordResetEmail: async (email: string) => {
    const user = await sendPasswordResetEmail(auth, email);
    return user;
  },

  doSendEmailVerification: async () => {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  },

  doUpdatePassword: async (password: string) => {
    if (!auth.currentUser) {
      throw new Error('No user logged in');
    }
    return updatePassword(auth.currentUser, password);
  },

  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const user = await signInWithPopup(auth, provider);
    set((state) => {
      return (state.user = user as never);
    });
  },
}));

export default useStore;
