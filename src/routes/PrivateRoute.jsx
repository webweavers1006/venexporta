import { useEffect } from 'react';
import { Route, useNavigate } from 'react-router';
import useAuthStore from '@src/store/authStore';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Component {...rest} /> : null;
};

export default PrivateRoute;