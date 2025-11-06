import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@breakout/design-system/lib/cn';
import { ScrollArea } from '@breakout/design-system/components/shadcn-ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
  TooltipArrow,
} from '@breakout/design-system/components/Tooltip/index';
import { useAuth } from '../../context/AuthProvider';
import { useSidebar } from '../../context/SidebarContext';
import SidebarHeader from './SidebarHeader';
import { getTenantIdentifierFromUrl } from '@meaku/core/utils/index';
import useBrandingAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import { ADMIN_DASHBOARD_COMPANY_NAME, SideNavView } from '../../utils/constants';
import PanelSettingsIcon from '@breakout/design-system/components/icons/panel-settings-icon';
import SidebarToggleIcon from '@breakout/design-system/components/icons/sidebar-toggle-icon';
import {
  SIDEBAR_V2_ACCORDION_SECTIONS,
  SIDEBAR_V2_SETTINGS_ITEMS,
  SIDEBAR_V2_SIGN_OUT_ITEM,
  INSIGHTS_ITEM,
  SidebarV2LinkItem,
  SidebarV2AccordionSection,
  SidebarV2SettingsGroup,
} from '../../utils/sidebarV2Constants';
import Separator from '@breakout/design-system/components/layout/separator';

/**
 * Animation configuration for accordion expand/collapse
 */
const accordionAnimation = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: {
    height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    opacity: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
};

/**
 * SidebarV2 Component
 * New sidebar with accordion-based navigation structure
 */
const SidebarV2 = () => {
  const location = useLocation();
  const { userInfo, logout } = useAuth();
  const orgList = userInfo?.organizations;
  // Use URL as primary source of truth for tenant
  const tenantIdentifier = getTenantIdentifierFromUrl();
  const tenantName = tenantIdentifier?.['tenant-name'];
  const organization = orgList?.find((org) => org['tenant-name'] === tenantName);
  const isUserSuperAdmin = Boolean((orgList?.length ?? 0) > 1 && orgList?.every((org) => org?.role === 'admin'));
  const TENANT_NAME = tenantIdentifier?.['name'] ?? organization?.name ?? ADMIN_DASHBOARD_COMPANY_NAME;

  // Fetch agent configs to get full logo and favicon
  const agentId = tenantIdentifier?.['agentId'];
  const { data: agentConfigs } = useBrandingAgentConfigsQuery({
    agentId: agentId ?? 0,
    enabled: Boolean(agentId),
  });

  // Full logo from agent metadata, fallback to org logo
  const FULL_LOGO_URL = agentConfigs?.metadata?.logo || tenantIdentifier?.['logo'] || '';
  const isTenantLogoUrlPresent = FULL_LOGO_URL.length > 0;

  // Favicon from agent orb config
  const FAVICON_URL = agentConfigs?.configs?.['agent_personalization:style']?.orb_config?.logo_url || '';

  // Get state and functions from context
  const {
    sideNavView,
    isCollapsed,
    setIsCollapsed,
    toggleSidebar,
    openAccordion,
    toggleAccordion,
    navigateToSettingsView,
    navigateToMainView,
  } = useSidebar();

  const isLinkActive = (url: string) => {
    const normalizedPath = tenantName ? location.pathname.replace(`/${tenantName}`, '') : location.pathname;

    // Exact match
    if (normalizedPath === url) {
      return true;
    }

    // For dynamic routes (e.g., /conversations/:id), match if path starts with url followed by /
    // But exclude cases where it's actually a different sibling route (e.g., /conversations/leads)
    if (normalizedPath.startsWith(url + '/')) {
      // Get the segment after the base url
      const remainingPath = normalizedPath.slice(url.length + 1);
      // If remaining path doesn't contain another slash OR looks like a UUID/sessionID, it's active
      // This allows /conversations/abc123 but not /conversations/leads
      return !remainingPath.includes('/') && !/^(leads|link-clicks)/.test(remainingPath);
    }

    return false;
  };

  const hasFeatureFlag = (featureFlag: string | undefined) => {
    if (!featureFlag) return true;
    return organization?.[featureFlag as keyof typeof organization] === true;
  };

  const renderNavItem = (item: SidebarV2LinkItem) => {
    if (!hasFeatureFlag(item.requiredFeatureFlag)) {
      return null;
    }

    const isDisabled = item.navUrl === '#' && !item.isActionItem;
    const isActive = !isDisabled && !item.isActionItem && isLinkActive(item.navUrl);
    const Icon = isActive ? item.activeIcon || item.icon : item.icon;

    const handleItemClick = (e: React.MouseEvent) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }

      if (item.isActionItem && item.navUrl === '#logout') {
        e.preventDefault();
        logout();
        return;
      }
    };

    const navContent = item.isActionItem ? (
      <button
        key={'sidebar-v2-nav-item-' + item.navItem.toLowerCase().replace(' ', '-')}
        onClick={handleItemClick}
        className={cn(
          'flex w-full items-center overflow-hidden rounded-lg text-sm font-normal transition-all duration-300',
          {
            // Expanded mode - action items (sign out)
            'gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50': !isCollapsed,
            // Collapsed mode - action items (sign out)
            'justify-center px-2 py-2.5 text-red-600': isCollapsed,
            // Disabled items
            'cursor-not-allowed text-gray-600 opacity-50': isDisabled,
          },
        )}
      >
        {Icon && (
          <div
            className={cn('flex items-center rounded p-1 transition-colors duration-300', {
              // Expanded mode - action items have white container
              'bg-white': !isCollapsed,
            })}
          >
            <Icon className="h-4 w-4 flex-shrink-0 transition-colors duration-300" />
          </div>
        )}
        <span
          className={cn(
            'inline-block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out',
            {
              'max-w-0 opacity-0': isCollapsed,
              'max-w-[200px] opacity-100': !isCollapsed,
            },
          )}
          style={{
            transitionDelay: isCollapsed ? '0ms' : '150ms',
          }}
        >
          {item.navItem}
        </span>
      </button>
    ) : (
      <Link
        to={tenantName ? `/${tenantName}${item.navUrl}` : item.navUrl}
        key={'sidebar-v2-nav-item-' + item.navItem.toLowerCase().replace(' ', '-')}
        onClick={handleItemClick}
        className={cn(
          'flex w-full items-center overflow-hidden rounded-lg text-sm font-normal transition-all duration-300',
          {
            // Expanded mode - active items
            'gap-3 bg-gray-900 px-3 py-2.5 text-white hover:bg-gray-900': isActive && !isCollapsed,
            // Expanded mode - non-active items
            'gap-3 px-3 py-2.5 text-gray-500 hover:bg-gray-100': !isActive && !isDisabled && !isCollapsed,
            // Collapsed mode - active items (no bg, no hover, centered, compact padding)
            'justify-center px-2 py-2.5 text-gray-900': isActive && isCollapsed,
            // Collapsed mode - non-active items (no bg, no hover, centered, compact padding)
            'justify-center px-2 py-2.5 text-gray-500': !isActive && !isDisabled && isCollapsed,
            // Disabled items
            'cursor-not-allowed text-gray-600 opacity-50': isDisabled,
          },
        )}
      >
        {Icon && (
          <div
            className={cn('flex items-center rounded p-1 transition-colors duration-300', {
              // Expanded mode - all items have white container
              'bg-white': !isCollapsed,
              // Collapsed mode - active items have dark container
              'bg-gray-800': isActive && isCollapsed,
              // Collapsed mode - non-active items have no container (no bg class)
            })}
          >
            <Icon
              className={cn('h-4 w-4 flex-shrink-0 transition-colors duration-300', {
                // Expanded mode - active items have dark icon
                'text-gray-900': isActive && !isCollapsed,
                // Collapsed mode - active items have white icon
                'text-white': isActive && isCollapsed,
              })}
            />
          </div>
        )}
        <span
          className={cn(
            'inline-block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out',
            {
              'max-w-0 opacity-0': isCollapsed,
              'max-w-[200px] opacity-100': !isCollapsed,
            },
          )}
          style={{
            transitionDelay: isCollapsed ? '0ms' : '150ms',
          }}
        >
          {item.navItem}
        </span>
      </Link>
    );

    // Wrap with tooltip when collapsed or disabled
    if (isCollapsed || isDisabled) {
      return (
        <TooltipProvider
          key={'sidebar-v2-nav-item-tooltip-' + item.navItem.toLowerCase().replace(' ', '-') + '-' + item.navUrl}
        >
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{navContent}</TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                side={isCollapsed ? 'right' : 'top'}
                className="border-none bg-gray-900 text-white duration-150 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <p>{isDisabled ? `${item.navItem} (Coming Soon)` : item.navItem}</p>
                <TooltipArrow className="fill-gray-900 !transition-none" width={12} height={6} />
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return navContent;
  };

  // Render section header with badge (shown when collapsed)
  const renderSectionHeader = (section: SidebarV2AccordionSection) => {
    // Use badge from section config, fallback to first two letters of title if not provided
    const badgeText = section.badge || section.title.substring(0, 2).toUpperCase();

    const badge = (
      <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-700">
        {badgeText}
      </div>
    );

    return (
      <TooltipProvider key={'sidebar-v2-section-header-' + section.title}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex w-full items-center justify-center px-2 py-2.5 transition-[max-height,opacity,padding] duration-300 ease-in-out',
                {
                  'max-h-12 opacity-100': isCollapsed,
                  'pointer-events-none max-h-0 py-0 opacity-0': !isCollapsed,
                },
              )}
            >
              <div className="flex items-center rounded p-1">{badge}</div>
            </div>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent
              side="right"
              className="border-none bg-gray-900 text-white duration-150 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            >
              <p>{section.title}</p>
              <TooltipArrow className="fill-gray-900" width={12} height={6} />
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderSettingsGroupWithNavItems = () => {
    // Group items by settingsGroup while preserving order
    const groupedItems = new Map<SidebarV2SettingsGroup | 'ungrouped', SidebarV2LinkItem[]>();
    const groupOrder: (SidebarV2SettingsGroup | 'ungrouped')[] = [];

    SIDEBAR_V2_SETTINGS_ITEMS.forEach((item) => {
      const group = item.settingsGroup || 'ungrouped';
      if (!groupedItems.has(group)) {
        groupedItems.set(group, []);
        groupOrder.push(group);
      }
      groupedItems.get(group)!.push(item);
    });

    return groupOrder.map((group, index) => {
      const items = groupedItems.get(group)!;
      return (
        <div key={group} className="space-y-1">
          {/* Group Header - Only show when not collapsed */}
          {group !== 'ungrouped' && (
            <div
              className={cn(
                'px-2 text-xs font-medium tracking-wider text-gray-700 transition-[max-height,opacity,padding] duration-300 ease-in-out',
                {
                  'pointer-events-none max-h-0 py-0 opacity-0': isCollapsed,
                  'max-h-6 py-1 opacity-100': !isCollapsed,
                },
              )}
            >
              {group}
            </div>
          )}
          {/* Group Items */}
          {items.map((item) => renderNavItem(item))}
          {index < groupOrder.length - 1 && <Separator />}
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        'relative flex h-[calc(100vh-32px)] flex-shrink-0 flex-col overflow-visible rounded-xl border bg-[#FCFCFD] transition-[width] duration-300 ease-in-out',
        {
          'w-[72px]': isCollapsed,
          'w-[270px]': !isCollapsed,
        },
      )}
      style={{
        contain: 'layout size',
        willChange: 'width',
      }}
    >
      {/* Header - Company Logo & Name */}
      <div
        className={cn('relative flex flex-col items-start justify-center self-stretch overflow-visible py-4', {
          'px-2': isCollapsed,
          'px-4': !isCollapsed,
        })}
      >
        <div
          className={cn('flex h-12 w-full items-center px-2', {
            'justify-center': isCollapsed,
            'justify-start': !isCollapsed,
          })}
        >
          <SidebarHeader
            isCollapsed={isCollapsed}
            tenantName={TENANT_NAME}
            tenantLogoUrl={FULL_LOGO_URL}
            faviconUrl={FAVICON_URL}
            isTenantLogoUrlPresent={isTenantLogoUrlPresent}
            isUserSuperAdmin={isUserSuperAdmin}
            organizations={orgList}
            onExpandSidebar={() => setIsCollapsed(false)}
          />
        </div>

        {/* Toggle Button - Positioned at top right, half overflowing */}
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className="group absolute -right-3 top-1/2 z-50 flex size-6 -translate-y-1/2 items-center overflow-visible rounded-lg border border-gray-300 bg-white transition-all"
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <div className="flex w-12 items-center justify-center">
                  <SidebarToggleIcon className="h-6 w-6 !text-gray-500 opacity-100 transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-0" />
                  {!isCollapsed ? (
                    <ChevronLeft className="-ml-3.5 -mt-0.5 h-3.5 w-3.5 !text-gray-500 opacity-0 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:opacity-100" />
                  ) : (
                    <ChevronRight className="-ml-3.5 -mt-0.5 h-3.5 w-3.5 !text-gray-500 opacity-0 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:opacity-100" />
                  )}
                </div>
              </button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                side="right"
                className="border-none bg-gray-900 text-white duration-150 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <p>{isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}</p>
                <TooltipArrow className="fill-gray-900 !transition-none" width={12} height={6} />
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Divider below logo */}
      <div className={cn('mb-4 border-t border-gray-200', { 'mx-4': !isCollapsed, 'mx-2': isCollapsed })} />

      {/* Main Navigation */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ScrollArea
          className={cn('sidebar-scrollbar h-full flex-1 [&>div>div]:h-full', {
            'p-2': isCollapsed,
            'p-4 pt-0': !isCollapsed,
          })}
          type="hover"
        >
          {sideNavView === SideNavView.MAIN ? (
            // MAIN VIEW - Accordion Sections + Insights
            <div className={cn('space-y-2', { 'max-w-[54px]': isCollapsed })}>
              {SIDEBAR_V2_ACCORDION_SECTIONS.map((section) => (
                <React.Fragment key={section.title}>
                  {/* Section Header Badge (visible when collapsed) */}
                  {renderSectionHeader(section)}

                  <div className="space-y-1">
                    {/* Accordion Header (hidden when collapsed) */}
                    <button
                      onClick={() => !isCollapsed && toggleAccordion(section.title)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2 text-sm font-normal text-gray-700 transition-[max-height,opacity,padding] duration-300 ease-in-out',
                        {
                          'pointer-events-none max-h-0 py-0 opacity-0': isCollapsed,
                          'max-h-12 py-2 opacity-100 hover:bg-gray-50': !isCollapsed,
                        },
                      )}
                    >
                      <span>{section.title}</span>
                      {openAccordion === section.title ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>

                    {/* Accordion Content - Always visible when collapsed, animated when expanded */}
                    {isCollapsed ? (
                      <div className="space-y-1">{section.items.map((item) => renderNavItem(item))}</div>
                    ) : (
                      <AnimatePresence initial={false}>
                        {openAccordion === section.title && (
                          <motion.div key={section.title} className="overflow-hidden" {...accordionAnimation}>
                            <div className="space-y-1 pl-2">{section.items.map((item) => renderNavItem(item))}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                  <hr />
                </React.Fragment>
              ))}

              {/* Insights Link - After accordions */}
              <div className="pt-2">{renderNavItem(INSIGHTS_ITEM)}</div>
            </div>
          ) : (
            // SETTINGS VIEW - Settings Items with Back Button
            <div className={cn('flex h-full flex-1 flex-col', { 'max-w-[54px]': isCollapsed })}>
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={navigateToMainView}
                        className={cn(
                          'mb-0 flex w-full items-center overflow-hidden rounded-lg px-2 py-2.5 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-100',
                          {
                            'justify-center px-2 py-2.5': isCollapsed,
                            'gap-3': !isCollapsed,
                          },
                        )}
                      >
                        <div className="flex items-center rounded bg-white p-1 transition-colors duration-300">
                          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                        </div>
                        <span
                          className={cn(
                            'inline-block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out',
                            {
                              'max-w-0 opacity-0': isCollapsed,
                              'max-w-[200px] opacity-100': !isCollapsed,
                            },
                          )}
                          style={{
                            transitionDelay: isCollapsed ? '0ms' : '150ms',
                          }}
                        >
                          Back to Dashboard
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipPortal>
                      {isCollapsed && (
                        <TooltipContent
                          side="right"
                          className="border-none bg-gray-900 text-white duration-150 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                        >
                          <p>Back to Dashboard</p>
                          <TooltipArrow className="fill-gray-900 !transition-none" width={12} height={6} />
                        </TooltipContent>
                      )}
                    </TooltipPortal>
                  </Tooltip>
                </TooltipProvider>

                <div className="space-y-4">{renderSettingsGroupWithNavItems()}</div>
              </div>

              {/* Sign Out Button - Positioned at bottom */}
              <div className="mt-auto pt-4">{renderNavItem(SIDEBAR_V2_SIGN_OUT_ITEM)}</div>
            </div>
          )}
        </ScrollArea>

        {/* Bottom Actions - Settings Button */}
        {sideNavView === SideNavView.MAIN && (
          <div className={cn({ 'p-2': isCollapsed, 'p-4': !isCollapsed })}>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={navigateToSettingsView}
                    className={cn(
                      'flex w-full items-center overflow-hidden rounded-lg text-sm font-normal text-gray-500 transition-all duration-300',
                      {
                        'gap-3 px-3 py-2.5 hover:bg-gray-100': !isCollapsed,
                        'justify-center px-2 py-2.5': isCollapsed,
                      },
                    )}
                  >
                    <div
                      className={cn('flex items-center rounded p-1 transition-colors duration-300', {
                        'bg-white': !isCollapsed,
                      })}
                    >
                      <PanelSettingsIcon className="h-4 w-4 flex-shrink-0 transition-colors duration-300" />
                    </div>
                    <span
                      className={cn(
                        'inline-block overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-in-out',
                        {
                          'max-w-0 opacity-0': isCollapsed,
                          'max-w-[200px] opacity-100': !isCollapsed,
                        },
                      )}
                      style={{
                        transitionDelay: isCollapsed ? '0ms' : '150ms',
                      }}
                    >
                      Settings
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipPortal>
                  {isCollapsed && (
                    <TooltipContent
                      side="right"
                      className="border-none bg-gray-900 text-white duration-150 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                    >
                      <p>Settings</p>
                      <TooltipArrow className="fill-gray-900 !transition-none" width={12} height={6} />
                    </TooltipContent>
                  )}
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarV2;
