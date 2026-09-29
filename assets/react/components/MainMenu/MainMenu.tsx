import { useNavigate } from 'react-router-dom';

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="dropdown">
      <button
        className="btn btn-info text-white dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"></button>
      <ul className="dropdown-menu">
        <li>
          <div className="dropdown-item cursor-pointer" onClick={() => location.reload()}>
            Actualiser
          </div>
        </li>
        <li>
          <div className="dropdown-item cursor-pointer" onClick={() => navigate('/logout')}>
            Déconnexion
          </div>
        </li>
      </ul>
    </div>
  );
};
export default MainMenu;
