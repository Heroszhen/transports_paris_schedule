import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';

const useUserStore = create((set) => ({
  user: null,
  login: false,
  setUser: (newUser) => {
    set((state) => ({ ...state, user: newUser }));
  },
}));
export default useUserStore;

export const setLogin = async (login) => {
  useUserStore.setState(() => ({ login: login }));
};

/**
 *
 * @param {Object} data
 * @return {Promise<boolean>}
 */
export const getAuth = async (data) => {
  try {
    let response = await fetch(`/api/login_check`, {
      method: 'POST',
      headers: getRequestHeaders(false, false),
      body: JSON.stringify(data),
    });

    response = await response.json();
    if (response.token) {
      localStorage.setItem('token', JSON.stringify({ token: response.token, email: data.email }));
      await getUser();

      return true;
    }
  } catch {}
  return false;
};

export const getUser = async () => {
  try {
    let response = await fetch(`/api/users/profile`, {
      method: 'GET',
      headers: getRequestHeaders(),
    });

    response = await response.json();
    if (response?.id) useUserStore.setState((state) => ({ ...state, user: response }));
  } catch {}
};
