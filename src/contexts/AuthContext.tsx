import { UserDTO } from '@dtos/UserDTO';
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/user/storageUser';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { api } from 'src/service/api';

export type AuthContextDataProps = {
  user: UserDTO;
  isLoadingStorageUserData: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingStorageUserData, setIsLoadingStorageUserData] =
    useState(true);

  async function signIn(email: string, password: string) {
    try {
      const response = await api.post('/sessions', { email, password });

      if (response.data.user) {
        setUser(response.data.user);
        storageUserSave(response.data.user);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setIsLoadingStorageUserData(true);
      setUser({} as UserDTO);
      await storageUserRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageUserData(false);
    }
  }

  async function loadUserData() {
    try {
      const userLogged = await storageUserGet();
      if (userLogged) {
        setUser(userLogged);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingStorageUserData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);
  return (
    <AuthContext.Provider
      value={{ user, signIn, isLoadingStorageUserData, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
