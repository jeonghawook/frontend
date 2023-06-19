import { create } from 'zustand';
import { persist } from 'zustand/middleware';


const useAuthStore = create(
  persist(
    (set) => ({
      isLogIn: false,
      email: '',
      isAdmin: '',
      userId:'',
      login: (email,isAdmin, userId) => set({isLogIn:true , email: email, isAdmin: isAdmin, userId:userId, }),
      logout: () => set({ isLogIn: false, email: '', isAdmin: '', userId:'' }),
    }),
    {
      name: 'auth-store',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
