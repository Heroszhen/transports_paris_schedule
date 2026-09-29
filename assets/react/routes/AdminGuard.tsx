import { Outlet, Navigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

const AdminGuard = () => {
  const { user } = useUserStore();

  return user?.roles.includes('ROLE_ADMIN') ? <Outlet /> : <Navigate to="/horaires" />;
};
export default AdminGuard;
