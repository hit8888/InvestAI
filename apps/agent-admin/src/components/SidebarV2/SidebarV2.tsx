import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
import { useSessionStore } from '../../stores/useSessionStore';
import { useSidebar } from '../../context/SidebarContext';
import SidebarHeader from './SidebarHeader';
import useBrandingAgentConfigsQuery from '../../queries/query/useAgentConfigsQuery';
import { ADMIN_DASHBOARD_COMPANY_NAME, SideNavView } from '../../utils/constants';
import PanelSettingsIcon from '@breakout/design-system/components/icons/panel-settings-icon';
import {
  SIDEBAR_V2_MAIN_SECTIONS,
  SIDEBAR_V2_SETTINGS_ITEMS,
  SIDEBAR_V2_SIGN_OUT_ITEM,
  INSIGHTS_ITEM,
  CONFIG_ITEM,
  SidebarV2LinkItem,
  SidebarV2SettingsGroup,
} from '../../utils/sidebarV2Constants';
import Separator from '@breakout/design-system/components/layout/separator';
import useAdminEventAnalytics from '../../hooks/useAdminEventAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

/**
 * SidebarV2 Component
 * Sidebar with grouped navigation structure
 */
const SidebarV2 = () => {
  const { trackAdminEvent } = useAdminEventAnalytics();
  const location = useLocation();
  const orgList = useSessionStore((state) => state.userInfo?.organizations) || [];
  const organization = useSessionStore((state) => state.activeTenant);
  const tenantName = organization?.['tenant-name'];
  const logout = useSessionStore((state) => state.logout);

  const isUserSuperAdmin = Boolean((orgList?.length ?? 0) > 1 && orgList?.every((org) => org?.role === 'admin'));
  const TENANT_NAME = organization?.name ?? ADMIN_DASHBOARD_COMPANY_NAME;

  // Fetch agent configs to get full logo and favicon
  const agentId = organization?.agentId;
  const { data: agentConfigs } = useBrandingAgentConfigsQuery({
    agentId: agentId ?? 0,
    enabled: Boolean(agentId),
  });

  // Full logo from agent metadata, fallback to org logo
  const FULL_LOGO_URL = agentConfigs?.metadata?.logo || organization?.logo || '';
  const isTenantLogoUrlPresent = FULL_LOGO_URL.length > 0;

  // Get state and functions from context
  const { sideNavView, isCollapsed, setIsCollapsed, toggleSidebar, navigateToSettingsView, navigateToMainView } =
    useSidebar();

  // Track hover state for floating overlay
  const [isHovered, setIsHovered] = useState(false);

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

  const renderNavItem = (item: SidebarV2LinkItem, forceExpanded = false) => {
    if (!hasFeatureFlag(item.requiredFeatureFlag)) {
      return null;
    }

    const isDisabled = item.navUrl === '#' && !item.isActionItem;
    const isActive = !isDisabled && !item.isActionItem && isLinkActive(item.navUrl);
    const Icon = isActive ? item.activeIcon || item.icon : item.icon;
    const isExpanded = forceExpanded || !isCollapsed;

    const handleItemClick = (e: React.MouseEvent) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }

      trackAdminEvent(ANALYTICS_EVENT_NAMES.ADMIN_DASHBOARD.ADMIN_DASHBOARD_SIDE_NAV_ITEM_CLICKED, {
        navItem: item.navItem,
      });

      if (item.isActionItem && item.navUrl === '#logout') {
        e.preventDefault();
        logout();
        return;
      }
    };

    const baseClasses = cn(
      'flex h-10 items-center overflow-hidden rounded-lg text-sm font-normal transition-[colors,shadow,width] duration-200',
      {
        'w-10 justify-center px-2 gap-0': !isExpanded,
        'w-full px-3 gap-3': isExpanded,
      },
    );

    const navContent = item.isActionItem ? (
      <button
        key={'sidebar-v2-nav-item-' + item.navItem.toLowerCase().replace(' ', '-')}
        onClick={handleItemClick}
        className={cn(baseClasses, 'text-red-600 hover:bg-red-50')}
        disabled={isDisabled}
      >
        {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
        <span
          className={cn(
            'inline-block overflow-hidden whitespace-nowrap text-sm transition-[max-width,opacity] duration-200 ease-out',
            {
              'max-w-0 opacity-0': !isExpanded,
              'max-w-[200px] opacity-100': isExpanded,
            },
          )}
        >
          {item.navItem}
        </span>
      </button>
    ) : (
      <Link
        to={tenantName ? `/${tenantName}${item.navUrl}` : item.navUrl}
        key={'sidebar-v2-nav-item-' + item.navItem.toLowerCase().replace(' ', '-')}
        onClick={handleItemClick}
        className={cn(baseClasses, {
          'bg-gray-200 text-gray-900 shadow-[inset_0_0_8px_rgba(0,0,0,0.08)]': isActive && !isDisabled,
          'text-gray-500 hover:bg-gray-100': !isActive && !isDisabled,
          'cursor-not-allowed text-gray-400 opacity-60': isDisabled,
        })}
      >
        {Icon && <Icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-gray-600' : 'text-gray-500')} />}
        <span
          className={cn(
            'inline-block overflow-hidden whitespace-nowrap text-sm transition-[max-width,opacity] duration-200 ease-out',
            {
              'max-w-0 opacity-0': !isExpanded,
              'max-w-[200px] opacity-100': isExpanded,
            },
          )}
        >
          {item.navItem}
        </span>
      </Link>
    );

    // Wrap with tooltip only when disabled (not when collapsed)
    if (isDisabled) {
      return (
        <TooltipProvider
          key={'sidebar-v2-nav-item-tooltip-' + item.navItem.toLowerCase().replace(' ', '-') + '-' + item.navUrl}
        >
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{navContent}</TooltipTrigger>
            <TooltipPortal>
              <TooltipContent
                side="top"
                className="border-none bg-gray-900 text-white duration-150 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <p>{`${item.navItem} (Coming Soon)`}</p>
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
  const renderSettingsGroupWithNavItems = (forceExpanded = false) => {
    // Group items by settingsGroup while preserving order
    const groupedItems = new Map<SidebarV2SettingsGroup | 'ungrouped', SidebarV2LinkItem[]>();
    const groupOrder: (SidebarV2SettingsGroup | 'ungrouped')[] = [];
    const isExpanded = forceExpanded || !isCollapsed;

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
        <div key={group} className="space-y-1 px-2">
          {/* Group Header */}
          {group !== 'ungrouped' && (
            <div
              className={cn(
                'flex items-center overflow-hidden whitespace-nowrap px-2 text-xs font-medium uppercase tracking-wide text-gray-400',
                {
                  'w-10 justify-center': !isExpanded,
                  'max-w-[200px]': isExpanded,
                },
              )}
            >
              {isExpanded ? group : group.charAt(0)}
            </div>
          )}
          {/* Group Items */}
          {items.map((item) => renderNavItem(item, forceExpanded))}
          {index < groupOrder.length - 1 && <Separator />}
        </div>
      );
    });
  };

  // Render sidebar content - same for expanded and hover overlay (only positioning differs)
  const renderSidebarContent = (forHoverOverlay = false) => {
    return (
      <>
        {/* Header - Company Logo & Name */}
        <div className="relative flex flex-col items-start justify-center self-stretch overflow-visible">
          <div className="flex w-full items-center justify-start px-2">
            <SidebarHeader
              isCollapsed={false}
              tenantName={TENANT_NAME}
              tenantLogoUrl={FULL_LOGO_URL}
              faviconUrl={''}
              isTenantLogoUrlPresent={isTenantLogoUrlPresent}
              isUserSuperAdmin={isUserSuperAdmin}
              organizations={orgList}
              onExpandSidebar={() => setIsCollapsed(false)}
              onToggleCollapse={toggleSidebar}
              isHovered={forHoverOverlay}
            />
          </div>
        </div>

        {/* Divider below logo */}
        <Separator className="my-4" />

        {/* Main Navigation */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea className="sidebar-scrollbar h-full flex-1 pt-0" type="hover">
            {sideNavView === SideNavView.MAIN ? (
              // MAIN VIEW - Grouped Navigation + Insights
              <div className="">
                {SIDEBAR_V2_MAIN_SECTIONS.map((section, index) => (
                  <div key={section.title} className={cn('flex flex-col items-start justify-start')}>
                    <div className="pb flex h-6 max-w-[200px] items-center overflow-hidden whitespace-nowrap border border-transparent px-2 text-xs font-medium capitalize tracking-wide text-gray-400 opacity-100">
                      {section.title}
                    </div>
                    <div className="w-full space-y-1">{section.items.map((item) => renderNavItem(item, true))}</div>
                    {index < SIDEBAR_V2_MAIN_SECTIONS.length - 1 && (
                      <Separator className="-mx-2 my-4 w-[calc(100%+1rem)]" />
                    )}
                  </div>
                ))}

                {/* Insights Link - After accordions */}
                <Separator className="-mx-2 my-4 w-[calc(100%+1rem)]" />
                <div className="space-y-2 pt-2">
                  {renderNavItem(INSIGHTS_ITEM, true)}
                  {renderNavItem(CONFIG_ITEM, true)}
                </div>
                <Separator className="-mx-2 my-4 w-[calc(100%+1rem)]" />
              </div>
            ) : (
              // SETTINGS VIEW - Settings Items with Back Button
              <div className="flex h-full flex-1 flex-col">
                <div className="space-y-2">
                  <button
                    onClick={navigateToMainView}
                    className="mb-0 flex w-full items-center gap-3 overflow-hidden rounded-lg px-2 py-2.5 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-100"
                  >
                    <div className="flex items-center rounded bg-white p-1 transition-colors duration-300">
                      <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <span className="inline-block max-w-[200px] overflow-hidden whitespace-nowrap opacity-100">
                      Back to Dashboard
                    </span>
                  </button>

                  <div className="space-y-4">{renderSettingsGroupWithNavItems(true)}</div>
                </div>

                {/* Sign Out Button - Positioned at bottom */}
                <div className="mt-auto pt-4">{renderNavItem(SIDEBAR_V2_SIGN_OUT_ITEM, true)}</div>
              </div>
            )}
          </ScrollArea>

          {/* Bottom Actions - Settings Button */}
          {sideNavView === SideNavView.MAIN && (
            <div>
              <button
                onClick={navigateToSettingsView}
                className="flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-normal text-gray-500 transition-colors duration-200 hover:bg-gray-100"
              >
                <PanelSettingsIcon className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <span className="inline-block max-w-[200px] overflow-hidden whitespace-nowrap opacity-100">
                  Settings
                </span>
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div
        className={cn(
          'relative flex h-screen flex-shrink-0 flex-col overflow-visible bg-[#FCFCFD] transition-[width,padding-left,padding-right] duration-200 ease-out',
          {
            'w-[56px] px-2': isCollapsed,
            'w-[200px] px-2': !isCollapsed,
          },
        )}
        style={{
          contain: 'layout size style',
          willChange: 'width',
          transform: 'translateZ(0)',
        }}
      >
        {/* Show collapsed content when collapsed (fades out on hover), expanded content when expanded */}
        {isCollapsed ? (
          // Collapsed state content - fades out when hovered
          <div
            className={cn('flex h-full flex-col transition-opacity duration-200 ease-out', {
              'pointer-events-auto opacity-100': !isHovered,
              'pointer-events-none opacity-0': isHovered,
            })}
            style={{
              willChange: 'opacity',
            }}
          >
            <div className="relative flex flex-col items-start justify-center self-stretch overflow-visible">
              <div className="flex w-full items-center justify-start">
                <SidebarHeader
                  isCollapsed={true}
                  tenantName={TENANT_NAME}
                  tenantLogoUrl={FULL_LOGO_URL}
                  faviconUrl={''}
                  isTenantLogoUrlPresent={isTenantLogoUrlPresent}
                  isUserSuperAdmin={isUserSuperAdmin}
                  organizations={orgList}
                  onExpandSidebar={() => setIsCollapsed(false)}
                  onToggleCollapse={toggleSidebar}
                  isHovered={isHovered}
                />
              </div>
            </div>
            <Separator className="my-4 flex-shrink-0" />
            <div
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
              onMouseEnter={() => isCollapsed && setIsHovered(true)}
              onMouseLeave={() => isCollapsed && setIsHovered(false)}
            >
              <ScrollArea className="sidebar-scrollbar min-h-0 flex-1 pt-0" type="hover">
                {sideNavView === SideNavView.MAIN ? (
                  <div className="">
                    {SIDEBAR_V2_MAIN_SECTIONS.map((section, index) => (
                      <div key={section.title} className={cn('flex flex-col items-start justify-start')}>
                        <div className="pb flex h-6 w-10 items-center justify-center overflow-hidden whitespace-nowrap border border-transparent px-2 text-xs font-medium capitalize tracking-wide text-gray-400">
                          {section.title.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1">{section.items.map((item) => renderNavItem(item, false))}</div>
                        {index < SIDEBAR_V2_MAIN_SECTIONS.length - 1 && (
                          <Separator className="-mx-2 my-4 w-[calc(100%+1rem)]" />
                        )}
                      </div>
                    ))}
                    <Separator className="-mx-2 my-4 w-[calc(100%+1rem)]" />
                    <div className="space-y-2 pt-2">
                      {renderNavItem(INSIGHTS_ITEM, false)}
                      {renderNavItem(CONFIG_ITEM, false)}
                    </div>
                    <Separator className="-mx-2 my-4 w-[calc(100%+1rem)]" />
                  </div>
                ) : (
                  <div className="flex h-full flex-1 flex-col">
                    <div className="space-y-2">
                      <button
                        onClick={navigateToMainView}
                        className="mb-0 flex w-10 items-center justify-center overflow-hidden rounded-lg px-2 py-2.5 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-100"
                      >
                        <div className="flex items-center rounded bg-white p-1">
                          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
                        </div>
                      </button>
                      <div className="space-y-4">{renderSettingsGroupWithNavItems(false)}</div>
                    </div>
                    <div className="mt-auto pt-4">{renderNavItem(SIDEBAR_V2_SIGN_OUT_ITEM, false)}</div>
                  </div>
                )}
              </ScrollArea>
              {sideNavView === SideNavView.MAIN && (
                <div
                  className="flex-shrink-0"
                  onMouseEnter={() => isCollapsed && setIsHovered(true)}
                  onMouseLeave={() => isCollapsed && setIsHovered(false)}
                >
                  <button
                    onClick={navigateToSettingsView}
                    className="flex w-10 items-center justify-center overflow-hidden rounded-lg px-2 py-2.5 text-sm font-normal text-gray-500 transition-colors duration-200 hover:bg-gray-100"
                  >
                    <PanelSettingsIcon className="h-4 w-4 flex-shrink-0 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Expanded state content (same as overlay)
          renderSidebarContent()
        )}
      </div>

      {/* Floating Overlay - Animates in on hover, same content as expanded */}
      {isCollapsed && (
        <div
          className={cn(
            'fixed left-0 top-0 z-[9999] flex h-screen flex-shrink-0 flex-col overflow-hidden bg-[#FCFCFD] px-2 shadow-xl transition-[width,opacity] duration-200 ease-out',
            {
              'w-[200px] opacity-100': isHovered,
              'pointer-events-none w-[56px] opacity-0': !isHovered,
            },
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            contain: 'layout size style',
            willChange: 'width, opacity',
            transform: 'translateZ(0)',
          }}
        >
          {renderSidebarContent(true)}
        </div>
      )}
    </>
  );
};

export default SidebarV2;
