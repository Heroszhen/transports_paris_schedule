import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';
import { ApiPlatformContext, IUser } from '../models/interfaces';

export type IAuth = {
  email: string;
  password: string;
};

interface UserState {
  user: ApiPlatformContext<IUser> | null;
  login: boolean;
  setUser(newUser: ApiPlatformContext<IUser> | null): void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  login: false,
  setUser: (newUser) => {
    set((state) => ({ ...state, user: newUser }));
  },
}));
export default useUserStore;

export const setLogin = async (login: boolean) => {
  useUserStore.setState(() => ({ login: login }));
};

export const getAuth = async (data: IAuth): Promise<boolean> => {
  try {
    const response = await fetch(`/api/login_check`, {
      method: 'POST',
      headers: getRequestHeaders(false, false),
      body: JSON.stringify(data),
    });

    const json: { token: string } = await response.json();
    if (json.token) {
      localStorage.setItem('token', JSON.stringify({ token: json.token, email: data.email }));
      await getUser();

      return true;
    }
  } catch {}
  return false;
};

export const getUser = async () => {
  try {
    const response = await fetch(`/api/users/profile`, {
      method: 'GET',
      headers: getRequestHeaders(),
    });

    const json: ApiPlatformContext<IUser> = await response.json();
    useUserStore.setState((state) => ({ ...state, user: json }));
  } catch {}
};
