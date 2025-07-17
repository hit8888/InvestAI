import { useLocation } from 'react-router-dom';

const useLocationPath = () => {
  const location = useLocation();

  const getConversationPath = (path: string) => {
    const pathParts = location.pathname.split('/');
    pathParts[pathParts.length - 1] = path;
    return pathParts.join('/');
  };

  return {
    getConversationPath,
  };
};

export default useLocationPath;
