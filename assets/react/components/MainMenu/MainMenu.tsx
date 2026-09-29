import { useNavigate, NavLink } from 'react-router-dom';
import useUserStore from '../../stores/userStore';

const MainMenu = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  return (
    <div className="dropdown">
      <button
        className="btn btn-info text-white dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"></button>
      <ul className="dropdown-menu">
        <li>
          <NavLink to="/horaires" className="dropdown-item">
            Métro
          </NavLink>
        </li>

        <li>
          <hr className="dropdown-divider" />
        </li>
        {user?.roles.includes('ROLE_ADMIN') && (
          <>
            <li>
              <NavLink to="/acteurs" className="dropdown-item">
                Acteurs
              </NavLink>
            </li>
            <li>
              <NavLink to="/films" className="dropdown-item">
                Films
              </NavLink>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
          </>
        )}
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
