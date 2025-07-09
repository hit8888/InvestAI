import { useSearchParams } from 'react-router-dom';

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set(key, value);
    setSearchParams(newParams, { replace: true });
  };

  const getParam = (key: string) => {
    return searchParams.get(key);
  };

  const setAgentOpen = () => {
    setParam('isAgentOpen', 'true');
  };

  const removeParam = (key: string) => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.delete(key);
    setSearchParams(newParams, { replace: true });
  };

  return {
    setParam,
    getParam,
    setAgentOpen,
    removeParam,
    searchParams,
  };
};
