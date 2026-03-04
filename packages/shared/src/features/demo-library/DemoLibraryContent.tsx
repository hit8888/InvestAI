import { useState, useEffect, useCallback } from 'react';
import { FeatureHeader } from '../../components/FeatureHeader';
import { VideoLibraryIcon } from '@neuraltrade/saral';
import type { FeatureContentProps } from '../';
import useDemoLibraryQuery from '../../network/http/queries/useDemoLibraryQuery';
import { MainDemoPlayer } from './components/MainDemoPlayer';
import { DemoRecommendations } from './components/DemoRecommendations';
import { DemoLibraryCTAs } from './components/DemoLibraryCTAs';
import { FullscreenDemoPlayer } from './components/FullscreenDemoPlayer';
import { DemoLibraryEmptyState } from './components/DemoLibraryEmptyState';
import { DemoLibraryErrorState } from './components/DemoLibraryErrorState';
import { Demo } from './types';
import { useCommandBarStore } from '../../stores';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import { CommandBarModuleTypeSchema } from '@neuraltrade/core/types/api/configuration_response';
import { trackError } from '../../utils/error';
import { useWatchedDemos } from './hooks/useWatchedDemos';

const { BOOK_MEETING } = CommandBarModuleTypeSchema.enum;

const DemoLibraryContent = ({ onClose, setActiveFeature }: FeatureContentProps) => {
  const { config } = useCommandBarStore();
  const { orb_config: orbConfig } = config.style_config;
  const featureConfig = useFeatureConfig(CommandBarModuleTypeSchema.enum.DEMO_LIBRARY);
  const bookMeetingFeatureConfig = useFeatureConfig(BOOK_MEETING);
  const { watchedDemos, addWatchedDemo, isDemoWatched } = useWatchedDemos();
  const [isMainDemoPlaying, setIsMainDemoPlaying] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);
  const [wasPlayingBeforeChange, setWasPlayingBeforeChange] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Create demo config for React Query
  const demoConfig = {
    agentId: config.agent_id?.toString() || '',
    moduleId: featureConfig?.id?.toString() || '',
    tenantName: config.org_name || '',
    sessionId: config.session_id || '',
    prospectId: config.prospect_id || '',
  };

  // Check if config is ready for the query
  const isConfigReady = Boolean(config.agent_id && featureConfig?.id && config.session_id && config.prospect_id);

  // Use React Query hook
  const {
    data: demos = [],
    isLoading,
    error,
    refetch,
  } = useDemoLibraryQuery(demoConfig, {
    enabled: isConfigReady,
  });

  // Select first demo when demos are loaded
  useEffect(() => {
    if (demos.length > 0 && !selectedDemoId) {
      // Try to find first unwatched demo
      const firstUnwatchedDemo = demos.find((demo) => !isDemoWatched(demo.id));
      // If all demos are watched, select the first demo
      setSelectedDemoId(firstUnwatchedDemo?.id || demos[0].id);
    }
  }, [demos, selectedDemoId, isDemoWatched]);

  // Track errors when they occur
  useEffect(() => {
    if (error) {
      trackError(error, {
        component: 'DemoLibraryContent',
        action: 'load_demos',
        sessionId: config.session_id,
      });
    }
  }, [error, config.session_id]);

  // Helper functions
  const getDemoById = useCallback(
    (id: string): Demo | undefined => {
      return demos.find((demo) => demo.id === id);
    },
    [demos],
  );

  const getDemoUrl = useCallback((demo: Demo): string => {
    return demo.asset.public_url;
  }, []);

  const handleDemoSelect = useCallback(
    (demoId: string) => {
      const wasPlaying = isMainDemoPlaying;
      setWasPlayingBeforeChange(wasPlaying);
      setSelectedDemoId(demoId);
      setIsMainDemoPlaying(false);
    },
    [isMainDemoPlaying],
  );

  const handleWatchNow = useCallback(
    (demoId: string) => {
      addWatchedDemo(demoId);
      setSelectedDemoId(demoId);
    },
    [addWatchedDemo],
  );

  const handleAskAIClick = () => {
    setActiveFeature?.(CommandBarModuleTypeSchema.enum.ASK_AI);
  };

  const handleBookMeetingClick = () => {
    setActiveFeature?.(CommandBarModuleTypeSchema.enum.BOOK_MEETING);
  };

  // Get all demo IDs for carousel (include all demos)
  const allDemoIds = demos.map((demo) => demo.id);

  // Simple loading state - if we have data, never show loading
  const isRecommendationsLoading = demos.length === 0;

  // Simple component without complex memoization
  const recommendationsComponent = (
    <DemoRecommendations
      key={`recommendations-${allDemoIds.length}`}
      demoIds={allDemoIds}
      selectedDemoId={selectedDemoId}
      getDemoById={getDemoById}
      getDemoUrl={getDemoUrl}
      onDemoSelect={handleDemoSelect}
      isLoading={isRecommendationsLoading}
      isDemoWatched={isDemoWatched}
    />
  );

  const renderContent = () => {
    if (error) {
      return <DemoLibraryErrorState onRetry={refetch} error={error} />;
    }

    if (demos.length === 0 && isConfigReady && !isLoading) {
      return <DemoLibraryEmptyState />;
    }

    return (
      <div>
        {/* Main Demo */}
        <div className="flex-shrink-0 mb-4 z-50 h-auto">
          <MainDemoPlayer
            demoId={selectedDemoId}
            getDemoById={getDemoById}
            getDemoUrl={getDemoUrl}
            onPlayingStateChange={setIsMainDemoPlaying}
            isLoading={!isConfigReady || isLoading}
            wasPlaying={wasPlayingBeforeChange}
            onDemoSelect={handleDemoSelect}
            onWatchNow={handleWatchNow}
            watchedDemos={watchedDemos}
            addWatchedDemo={addWatchedDemo}
            onFullscreenChange={setIsFullscreen}
          />
        </div>

        {/* Demo Recommendations Carousel */}
        <div className="flex-shrink mb-4">{recommendationsComponent}</div>
      </div>
    );
  };

  return (
    <>
      <div className="flex w-full h-full flex-col rounded-[20px] border border-border-dark bg-background">
        {/* Hide content when fullscreen is active */}
        {!isFullscreen && (
          <>
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 bg-background">
              <FeatureHeader
                title="Demo Library"
                icon={<VideoLibraryIcon className="size-5" />}
                onClose={onClose}
                ctas={[]}
              />
            </div>

            {/* Scrollable Content Container */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
              <div className="p-4">{renderContent()}</div>
            </div>

            {/* Sticky CTAs at bottom - outside scrollable area */}
            <div className="sticky bottom-0 p-4 pt-4 border-t border-border-dark/20 bg-background z-10">
              <DemoLibraryCTAs
                onBookMeetingClick={handleBookMeetingClick}
                onAskAIClick={handleAskAIClick}
                orbConfig={orbConfig}
                showBookMeeting={!!bookMeetingFeatureConfig}
                isLoading={!isConfigReady || isLoading}
              />
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Demo Player - rendered outside the main container */}
      {(() => {
        const selectedDemo = isFullscreen && selectedDemoId ? getDemoById(selectedDemoId) : null;
        return selectedDemo ? (
          <FullscreenDemoPlayer
            demoUrl={getDemoUrl(selectedDemo)}
            demoTitle={selectedDemo.title}
            onClose={() => setIsFullscreen(false)}
          />
        ) : null;
      })()}
    </>
  );
};

export default DemoLibraryContent;
