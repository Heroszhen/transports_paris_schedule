import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(null);
    localStorage.clear();
    navigate('/');
  }, []);

  return null;
};
export default Logout;
