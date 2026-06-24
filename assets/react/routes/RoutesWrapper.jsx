import { Routes, Route, Navigate } from 'react-router-dom';
import LoginGuard from './LoginGuard.jsx';

import Login from '../pages/login/Login.jsx';
import Scheldule from '../pages/schedule/Scheldule.jsx';

const RoutesWrapper = (props) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/404" element={<Login />} />
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
