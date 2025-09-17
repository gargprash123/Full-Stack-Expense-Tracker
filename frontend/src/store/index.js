import { create } from 'zustand';

const useStore = create((set) => ({
    theme: localStorage.getItem('theme') ?? 'light',
    user: JSON.parse(localStorage.getItem('user')) ?? null,
    setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        set({ theme });
    },
    setCredentials: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    signOut: () => {
        localStorage.removeItem('user');
        set({ user: null });
    },
}));

export default useStore;