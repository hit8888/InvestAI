import { nanoid } from 'nanoid';
import { useEffect } from 'react';

const useSetDistinctIdOnAppMount = () => {
  useEffect(() => {
    const distinctId = localStorage.getItem('distinct_id');
    if (distinctId) {
      return;
    }
    localStorage.setItem('distinct_id', nanoid());
  }, []);
};

export { useSetDistinctIdOnAppMount };
