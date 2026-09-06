import { Outlet, Navigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const LoginGuard = () => {
  const { user } = useUserStore();
  return user === null && [null, ''].includes(localStorage.getItem('token')) ? <Navigate to="/404" /> : <Outlet />;
};
export default LoginGuard;
