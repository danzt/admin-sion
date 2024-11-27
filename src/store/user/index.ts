import { create } from 'zustand';
import { db } from '../../services/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore/lite';
import { User, UserRole, UserStatus } from '../../domain/user';
import { Store } from '../../domain/store';
import { formatDate } from '../../core/utils/FormattedDate';

const useStore = create<Store>((set) => ({
  users: [],
  loading: false,
  error: null,

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
}));

export default useStore;
