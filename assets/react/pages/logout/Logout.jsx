import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../stores/userStore.js';

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(null);
    localStorage.clear();
    navigate('/');
  }, []);
};
export default Logout;
