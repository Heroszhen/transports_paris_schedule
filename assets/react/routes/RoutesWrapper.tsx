import { Routes, Route, Navigate } from 'react-router-dom';
import LoginGuard from './LoginGuard';
import AdminGuard from './AdminGuard';

import Login from '../pages/login/Login';
import Scheldule from '../pages/schedule/Scheldule';
import Logout from '../pages/logout/Logout';

import { Actor } from '../pages/admin/actor/Actor';
import { Movie } from '../pages/admin/movie/Movie';

interface IProps {
  canQuery: boolean;
}

const RoutesWrapper = (props: IProps) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/404" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        {props.canQuery && (
          <>
            <Route element={<LoginGuard />}>
              <Route path="/horaires" element={<Scheldule />} />
              <Route element={<AdminGuard />}>
                <Route path="/acteurs" element={<Actor />} />
                <Route path="/films" element={<Movie />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
          </>
        )}
      </Routes>
    </>
  );
};
export default RoutesWrapper;
