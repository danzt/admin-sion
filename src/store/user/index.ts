import { create } from "zustand";
import { db } from "../../services/firebase";
import { collection, addDoc, getDoc } from "firebase/firestore/lite";

interface User {
  name: string;
  email: string;
}

interface Store {
  records: User[];
  addUser: (record: User) => Promise<void>;
}

const useStore = create<Store>((set) => ({
  records: [],
  addUser: async (record: User) => {
    try {
      const usersCollection = collection(db, "users");
      const docRef = await addDoc(usersCollection, record);
      const docSnap = await getDoc(docRef);

      console.log("Document written with ID: ", docRef.id);
      console.log("Document data: ", docSnap.data());

      set((state) => ({
        records: [...state.records, { ...record, id: docRef.id }],
      }));
    } catch (error) {
      console.error("Error al crear el registro:", error);
    }
  },
}));

export default useStore;
