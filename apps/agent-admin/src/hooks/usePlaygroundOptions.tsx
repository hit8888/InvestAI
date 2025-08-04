import { PlaygroundView } from '@meaku/core/types/common';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { getAgentIdFromTenant } from '../utils/apiCalls';
import { useEffect, useState, useRef } from 'react';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { getUserEmailFromLocalStorage } from '@meaku/core/utils/index';
import SuccessToastMessage from '@breakout/design-system/components/layout/SuccessToastMessage';

const AGENT_BASE_URL = import.meta.env.VITE_AGENT_BASE_URL;
const PLAYGROUND_VIEW_KEY = 'playground_view_key';
const PLAYGROUND_VIEW_CHANGED_TOAST_DELAY = 1500;

const PLAYGROUND_VIEW_CHANGED_TOAST_MESSAGE: Record<PlaygroundView, string> = {
  [PlaygroundView.ADMIN_VIEW]: 'Admin View enabled. Includes analytics and insights hidden from end users.',
  [PlaygroundView.USER_PREVIEW]: 'User View enabled. Excludes analytics and insights.',
};

const getInitialPlaygroundView = (): PlaygroundView => {
  const storedValue = localStorage.getItem(PLAYGROUND_VIEW_KEY);
  if (storedValue) {
    try {
      const parsedValue = JSON.parse(storedValue);
      // Validate if the parsed value is a valid PlaygroundView enum member.
      if (Object.values(PlaygroundView).includes(parsedValue)) {
        return parsedValue;
      }
    } catch (error) {
      console.error('Failed to parse playground view from localStorage', error);
    }
  }
  return PlaygroundView.ADMIN_VIEW;
};

const usePlaygroundOptions = () => {
  const { tenantName: tenantNameParam } = useParams();
  const { userInfo } = useAuth();
  const orgList = userInfo?.organizations;
  const matchingOrg = orgList?.find((org) => org['tenant-name'] === tenantNameParam);

  const [orgAgentId, setOrgAgentId] = useState<number | null>(null);
  const [view, setView] = useState(getInitialPlaygroundView);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlaygroundViewChange = (value: string) => {
    setView(value as PlaygroundView);
    localStorage.setItem(PLAYGROUND_VIEW_KEY, JSON.stringify(value));

    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    // Set new timeout and store the ID
    toastTimeoutRef.current = setTimeout(() => {
      SuccessToastMessage({
        title: PLAYGROUND_VIEW_CHANGED_TOAST_MESSAGE[value as PlaygroundView],
      });
      toastTimeoutRef.current = null; // Clear the ref after execution
    }, PLAYGROUND_VIEW_CHANGED_TOAST_DELAY);
  };

  useEffect(() => {
    const getOrgAgentId = async () => {
      if (matchingOrg) {
        const agentId = await getAgentIdFromTenant();
        setOrgAgentId(agentId);
      } else {
        setOrgAgentId(null);
      }
    };

    getOrgAgentId();
  }, [matchingOrg]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const tenantName = matchingOrg?.['tenant-name'] ?? getTenantFromLocalStorage();
  const userEmail = getUserEmailFromLocalStorage() || '';

  let agentBaseUrl = AGENT_BASE_URL;
  if (view === PlaygroundView.ADMIN_VIEW) {
    agentBaseUrl = `${agentBaseUrl}/demo`;
  }

  const isUserView = view === PlaygroundView.USER_PREVIEW;

  const iframeSrc = orgAgentId
    ? `${agentBaseUrl}/org/${tenantName}/agent/${orgAgentId}/?bc=true&email=${userEmail}&container_id=embedded-breakout-agent&isAgentOpen=true&view=${view}`
    : '';

  return {
    view,
    isUserView,
    iframeSrc,
    handlePlaygroundViewChange,
  };
};

export default usePlaygroundOptions;
