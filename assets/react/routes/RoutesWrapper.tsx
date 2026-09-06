import { Routes, Route, Navigate } from 'react-router-dom';
import LoginGuard from './LoginGuard';

import Login from '../pages/login/Login';
import Scheldule from '../pages/schedule/Scheldule';
import Logout from '../pages/logout/Logout';

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
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
          </>
        )}
      </Routes>
    </>
  );
};
export default RoutesWrapper;
