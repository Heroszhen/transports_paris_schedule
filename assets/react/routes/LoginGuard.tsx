import { Outlet, Navigate } from 'react-router-dom';

const LoginGuard = () => {
  return [null, ''].includes(localStorage.getItem('token')) ? <Navigate to="/404" /> : <Outlet />;
};
export default LoginGuard;
