import { create } from 'zustand';

const useStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) ?? null,
    // Add a 'data version' number to track changes
    dataVersion: 0,

    setCredentials: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    signOut: () => {
        localStorage.removeItem('user');
        set({ user: null });
    },
    // Add an action to increment the version, signaling a refresh is needed
    refreshData: () => {
        set(state => ({ dataVersion: state.dataVersion + 1 }));
    },
}));

export default useStore;