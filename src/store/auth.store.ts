import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/media.types'
// MOCK AUTH ONLY: no real security. Replace login/register/logout with backend calls later.
interface AuthState { user: User | null; login: (email: string, pw: string) => void; register: (name: string, email: string, pw: string) => void; logout: () => void }
const valid = (email: string, pw: string) => { if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Enter a valid email address.'); if (pw.length < 6) throw new Error('Password must be at least 6 characters.') }
export const useAuth = create<AuthState>()(persist((set) => ({ user: null,
  login: (email, pw) => { valid(email, pw); set({ user: { id: email, name: email.split('@')[0], email } }) },
  register: (name, email, pw) => { valid(email, pw); if (!name.trim()) throw new Error('Enter your name.'); set({ user: { id: email, name: name.trim(), email } }) },
  logout: () => set({ user: null }) }), { name: 'rh-auth' }))
