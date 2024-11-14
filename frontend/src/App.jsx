import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { isExpired } from 'react-jwt';
import LoginPage from './componants/pages/LoginPage';
import HomePage from './componants/pages/HomePage';
import AdminPage from './componants/AdminPage/AdminPage';
import Employer from './componants/AdminPage/Employer';
import Materiel from './componants/AdminPage/Materiel';
import Profile from './componants/AdminPage/Profile';
import { getMe, logout, setMe } from './redux/action/auth.action';
import Settings from './componants/pages/Settings';
import Dashboard from './componants/AdminPage/Dashboard';
import MotOublier from './componants/pages/MotOublier';

function ProtectedRoute({ children }) {
  const jwt_access = localStorage.getItem("jwt_access");
  const location = useLocation();
  
  if (!jwt_access || isExpired(jwt_access)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  const jwt_access = localStorage.getItem("jwt_access");
  const location = useLocation();
  const dispatch = useDispatch();
  const { me } = useSelector(state => state.auth);

  useEffect(() => {
    if (jwt_access) {
      if (isExpired(jwt_access)) {
        // Token expiré, on se déconnecte
        dispatch(logout(location.pathname + location.search));
      } else {
        if (!me) {
          dispatch(getMe(location.pathname + location.search));
        }
      }
    } else {
      if (!me) {
        dispatch(setMe(null));
      }
    }
  }, [location, dispatch, jwt_access, me]);

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/login/oublier' element={<MotOublier />} />


      {/* Routes protégées */}
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      }>
        <Route index element={<HomePage />} />
        <Route path='profile' element={<Profile />} />
        <Route path='settings' element={<Settings/>}/>
      </Route>

      <Route path='/admin' element={ <AdminPage /> }>
        <Route index element={ 
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
         }></Route>
        <Route path='users' element={
          <ProtectedRoute>
            <Employer />
          </ProtectedRoute>
        } />
        <Route path='tools' element={
          <ProtectedRoute>
            <Materiel />
          </ProtectedRoute>
        } />
        <Route path='settings' element={
          <ProtectedRoute>
           <Settings/>
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
