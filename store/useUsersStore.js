import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUsersStore = create(
  persist(
    (set) => ({
      users: [
        { id: 'U001', name: 'Demo User', email: 'demo@example.com', createdAt: '2025-01-01', role: 'user' },
        { id: 'U002', name: 'John Doe', email: 'john@example.com', createdAt: '2025-01-15', role: 'user' },
        { id: 'U003', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2025-02-01', role: 'user' },
      ],
      addUser: (userData) =>
        set((state) => {
          const id = 'U' + String(state.users.length + 1).padStart(3, '0');
          return {
            users: [
              ...state.users,
              {
                id,
                name: userData.name || 'User',
                email: userData.email || '',
                createdAt: new Date().toISOString().slice(0, 10),
                role: 'user',
              },
            ],
          };
        }),
    }),
    { name: 'trips-users-storage' }
  )
);
