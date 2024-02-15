import { UserDTO } from '@dtos/UserDTO';
import { ReactNode, createContext } from 'react';

export type AuthContextDataProps = {
  user: UserDTO;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

type AuthContextProviderProps = {
  children: ReactNode;
};

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  return (
    <AuthContext.Provider
      value={{
        user: {
          id: '1',
          name: 'Igor Vicente',
          email: 'igor@gmail.com',
          avatar: 'iw.programacao.png',
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
