import { User } from "@supabase/supabase-js";
import { create } from "zustand";

interface UserState {
    user: User | null;
    updateUser: (user: User) => void;
}

const userStore = (set: any, get: any) => ({
    user: null,
    updateUser: (user: User) => {
        set(() => ({ user }));
    }
});

const useUserStore = create<UserState>()(userStore);

export default useUserStore;