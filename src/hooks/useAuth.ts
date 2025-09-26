import { create } from 'zustand';
export type Plan = 'Free' | 'Pro' | 'Team';
interface AuthState {
  isAuthenticated: boolean;
  user: { email: string; name: string; plan: Plan } | null;
  login: (email: string) => void;
  logout: () => void;
  changePlan: (newPlan: Plan) => void;
}
export const useAuth = create<AuthState>()(
  (set) => ({
    isAuthenticated: false,
    user: null,
    login: (email) =>
      set({
        isAuthenticated: true,
        user: { email, name: email.split('@')[0], plan: 'Free' },
      }),
    logout: () => set({ isAuthenticated: false, user: null }),
    changePlan: (newPlan) =>
      set((state) => {
        if (state.user) {
          return { user: { ...state.user, plan: newPlan } };
        }
        return {};
      }),
  })
);