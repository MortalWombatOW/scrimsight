import { atom } from 'jotai';

export interface ScrimsightUser {
  username: string;
  avatar?: string;
  plan: 'free' | 'pro';
}

export interface AuthState {
  authenticatedUser: ScrimsightUser | null;
}

const initialAuthState: AuthState = {
  authenticatedUser: null,
};

export const authAtom = atom<AuthState>(initialAuthState);