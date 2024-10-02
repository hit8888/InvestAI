import { useLocation } from "react-router-dom";

const useIsAdmin = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("/demo/");

  return isAdmin;
};

export default useIsAdmin;
