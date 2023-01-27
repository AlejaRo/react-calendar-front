import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../api';
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
  onLogoutCalendar,
} from '../store';

export const useAuthStore = () => {
  const dispatch = useDispatch();
  const { status, user, errorMessage } = useSelector((state) => state.auth);

  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await calendarApi.post('/auth', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      const user = {
        name: data.name,
        uid: data.uid,
      };

      dispatch(onLogin(user));
    } catch (error) {
      dispatch(onLogout('Credenciales incorrectas'));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async (newUser) => {
    dispatch(onChecking());
    try {
      const { data } = await calendarApi.post('/auth/new', newUser);
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      const user = {
        name: data.name,
        uid: data.uid,
      };

      dispatch(onLogin(user));
    } catch (error) {
      const message =
        error.response.data?.message || 'Contacte al administrador';
      dispatch(onLogout(message));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');

    if (!token) return dispatch(onLogout());

    try {
      const { data } = await calendarApi.get('/auth/renew');
      localStorage.setItem('token', data.token);
      localStorage.setItem('token-init-date', new Date().getTime());

      const user = {
        name: data.name,
        uid: data.uid,
      };

      dispatch(onLogin(user));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return {
    //* Properties
    errorMessage,
    status,
    user,

    //* Methods
    checkAuthToken,
    startLogout,
    startLogin,
    startRegister,
  };
};
