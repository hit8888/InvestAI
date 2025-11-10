import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { ActiveConversation } from '../context/ActiveConversationsContext';
import useWebpagesScreenshotsQuery from '../queries/query/useWebpagesScreenshotsQuery';
import { useSessionStore } from '../stores/useSessionStore';

type UseWebpageScreenshotsActiveConversationProps = {
  conversations: ActiveConversation[] | undefined;
  activeConversations: ActiveConversation[] | null;
  setActiveConversations: (conversations: ActiveConversation[]) => void;
};

const useWebpageScreenshotsActiveConversation = ({
  conversations,
  activeConversations,
  setActiveConversations,
}: UseWebpageScreenshotsActiveConversationProps) => {
  const queryClient = useQueryClient();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  const webpagesScreenshotsUrls = useMemo(() => {
    return (
      activeConversations
        ?.map((c) => c.prospect.browsed_urls?.[c.prospect.browsed_urls.length - 1]?.url ?? c.prospect.parent_url)
        .filter(Boolean) ?? []
    );
  }, [activeConversations]);

  const { data: webpagesScreenshotsData, isLoading: isWebpagesScreenshotsLoading } = useWebpagesScreenshotsQuery(
    {
      urls: webpagesScreenshotsUrls,
    },
    {
      enabled: !!webpagesScreenshotsUrls.length,
    },
  );

  const handleWebpageScreenshotData = useCallback(
    (conversations: ActiveConversation[] | undefined) => {
      if (!conversations) return null;
      return conversations?.map((c) => {
        const webpagesScreenshot = webpagesScreenshotsData?.available_screenshot_webpages.find((w) => {
          const url = c.prospect.browsed_urls?.[c.prospect.browsed_urls.length - 1]?.url ?? c.prospect.parent_url;
          return w.url === url;
        });
        return {
          ...c,
          webpage_screenshot: webpagesScreenshot?.screenshot,
        };
      });
    },
    [webpagesScreenshotsData],
  );

  useEffect(() => {
    if (conversations && webpagesScreenshotsData && webpagesScreenshotsData.available_screenshot_webpages.length > 0) {
      const newConversations = handleWebpageScreenshotData(conversations);
      setActiveConversations(newConversations ?? []);
    }
  }, [webpagesScreenshotsData, conversations]);

  // Invalidate webpages screenshots query on every 30 seconds if triggered_generation has values
  useEffect(() => {
    if (webpagesScreenshotsData?.triggered_generation && webpagesScreenshotsData.triggered_generation.length > 0) {
      const intervalId = setInterval(() => {
        queryClient.invalidateQueries({
          queryKey: ['webpages-screenshots-data', tenantName, webpagesScreenshotsUrls],
        });
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [webpagesScreenshotsData?.triggered_generation, queryClient, tenantName, webpagesScreenshotsUrls]);

  return {
    webpagesScreenshotsData,
    isWebpagesScreenshotsLoading,
    handleWebpageScreenshotData,
  };
};

export default useWebpageScreenshotsActiveConversation;
