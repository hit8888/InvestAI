import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthProvider';
import { useEffect } from 'react';

const Root = () => {
  const {
    // isAuthenticated,
    login,
    saveTokens,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  // console.log("isloginPage", isLoginPage, isAuthenticated);

  useEffect(() => {
    // Check for tokens in local storage on page load
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUserInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo') as string)
      : null;

    console.log('storedAccessToken', storedAccessToken, storedRefreshToken, storedUserInfo);

    if (storedAccessToken && storedRefreshToken) {
      if (saveTokens) {
        saveTokens(storedAccessToken, storedRefreshToken, storedUserInfo);
      }
      login(); // Set isAuthenticated to true
      navigate('/leads'); // Redirect to leads page
    } else {
      navigate('/login'); // Redirect to login if tokens are not present
    }
  }, [navigate]);
  return (
    <div className="flex w-full">
      {!isLoginPage ? <Sidebar /> : null}
      <div className={`${isLoginPage ? 'w-full' : 'flex-1'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
