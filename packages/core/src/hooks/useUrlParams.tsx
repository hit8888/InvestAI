import { useSearchParams } from 'react-router-dom';

export const useUrlParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        prev.set(key, value);
        return prev;
      },
      { replace: true },
    );
  };

  const getParam = (key: string) => {
    return searchParams.get(key);
  };

  const setAgentOpen = () => {
    setParam('isAgentOpen', 'true');
  };

  return {
    setParam,
    getParam,
    setAgentOpen,
    searchParams,
  };
};
