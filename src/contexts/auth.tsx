'use client';

import { ReactNode, createContext, useCallback, useMemo, useState } from 'react';

import { authService } from '@/services';
import storage from '@/utils/storage';

import User from '@/types/user';

type AuthContextProps = {
  meProfile: User | null;
  signIn: (payload: { email: string; password: string }) => Promise<any>;
  signUp: (payload: { email: string; password: string }) => Promise<any>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [meProfile, setMeProfile] = useState<User | null>(null);

  const getMeProfile = useCallback(async () => {}, []);

  const signIn = useCallback(
    async (payload: { email: string; password: string }) => {
      const response = await authService.signIn(payload);

      if (response.accessToken) {
        storage.setItem('token', response.accessToken);
        await getMeProfile();
      } else {
        setMeProfile(null);
        storage.removeItem('token');
      }
    },
    [getMeProfile],
  );

  const signUp = useCallback(
    async (payload: { email: string; password: string }) => {
      const response = await authService.signUp(payload);

      if (response.accessToken) {
        storage.setItem('token', response.accessToken);
        await getMeProfile();
      } else {
        setMeProfile(null);
        storage.removeItem('token');
      }
    },
    [getMeProfile],
  );

  const signOut = useCallback(() => {
    storage.removeItem('token');
    setMeProfile(null);
  }, []);

  const value = useMemo(() => {
    return { signIn, signOut, meProfile, signUp };
  }, [signIn, signOut, meProfile, signUp]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
