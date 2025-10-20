import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@breakout/design-system/lib/cn';
import { ScrollArea } from '@breakout/design-system/components/shadcn-ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
} from '@breakout/design-system/components/Tooltip/index';
import { useAuth } from '../../context/AuthProvider';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { ADMIN_DASHBOARD_COMPANY_NAME, SideNavView } from '../../utils/constants';
import PanelSettingsIcon from '@breakout/design-system/components/icons/panel-settings-icon';
import {
  SIDEBAR_V2_ACCORDION_SECTIONS,
  SIDEBAR_V2_SETTINGS_ITEMS,
  INSIGHTS_ITEM,
  SidebarV2LinkItem,
  SidebarV2AccordionGroup,
  SidebarV2SettingsGroup,
} from '../../utils/sidebarV2Constants';

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
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuth();
  const orgList = userInfo?.organizations;
  const tenantIdentifier = getTenantIdentifier();
  const tenantName = tenantIdentifier?.['tenant-name'];
  const organization = orgList?.find((org) => org['tenant-name'] === tenantName);
  const isUserSuperAdmin = Boolean((orgList?.length ?? 0) > 1 && orgList?.every((org) => org?.role === 'admin'));
  const TENANT_NAME = tenantIdentifier?.['name'] ?? ADMIN_DASHBOARD_COMPANY_NAME;
  const TENANT_LOGO_URL = tenantIdentifier?.['logo'] ?? '';
  const isTenantLogoUrlPresent = TENANT_LOGO_URL.length > 0;

  // Track which view we're in (MAIN or SETTINGS)
  const [sideNavView, setSideNavView] = useState<SideNavView>(() => {
    const pathURL = location.pathname;
    if (pathURL.includes('settings')) {
      return SideNavView.SETTINGS;
    }
    return SideNavView.MAIN;
  });

  // Track which accordion sections are open (multi-mode - multiple can be open)
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    [SidebarV2AccordionGroup.BREAKOUT_BLOCKS]: true,
    [SidebarV2AccordionGroup.VISITOR_REVEAL]: true,
  });

  const toggleAccordion = (title: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const navigateToSettingsView = () => {
    const defaultRoute = SIDEBAR_V2_SETTINGS_ITEMS.find(
      (item) => item.settingsGroup === SidebarV2SettingsGroup.WORKSPACE_SETTINGS,
    )?.navUrl;

    setSideNavView(SideNavView.SETTINGS);
    if (defaultRoute) {
      const basePath = tenantName ? `/${tenantName}${defaultRoute}` : defaultRoute;
      navigate(basePath, { state: { from: 'settings' } });
    }
  };

  const navigateToMainView = () => {
    const firstMainItem = SIDEBAR_V2_ACCORDION_SECTIONS[0]?.items[0];
    setSideNavView(SideNavView.MAIN);
    if (location.state?.from === 'settings') {
      navigate(-1);
    } else if (firstMainItem) {
      handleNavigation(firstMainItem.navUrl);
    }
  };

  const handleNavigation = (url: string) => {
    const basePath = tenantName ? `/${tenantName}${url}` : url;
    navigate(basePath);
  };

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

    const isDisabled = item.navUrl === '#';
    const isActive = !isDisabled && isLinkActive(item.navUrl);
    const Icon = isActive ? item.activeIcon || item.icon : item.icon;

    const navButton = (
      <Link
        to={tenantName ? `/${tenantName}${item.navUrl}` : item.navUrl}
        key={'sidebar-v2-nav-item-' + item.navItem.toLowerCase().replace(' ', '-')}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
          }
        }}
        className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal transition-all', {
          'bg-gray-900 text-white hover:bg-gray-900 [&_svg]:text-gray-700': isActive,
          'text-gray-500 hover:bg-gray-100': !isActive && !isDisabled,
          'cursor-not-allowed text-gray-400 opacity-50': isDisabled,
        })}
      >
        {Icon && (
          <div className="flex items-center rounded bg-white p-1">
            <Icon className="h-4 w-4 flex-shrink-0" />
          </div>
        )}
        <span className="truncate">{item.navItem}</span>
      </Link>
    );

    // Wrap disabled items with tooltip
    if (isDisabled) {
      return (
        <TooltipProvider
          key={'sidebar-v2-nav-item-tooltip-' + item.navItem.toLowerCase().replace(' ', '-') + '-' + item.navUrl}
        >
          <Tooltip>
            <TooltipTrigger asChild>{navButton}</TooltipTrigger>
            <TooltipPortal>
              <TooltipContent className="bg-gray-900 text-white">
                <p>Coming Soon</p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return navButton;
  };

  const renderTenantHeader = () => {
    const logoContent = isTenantLogoUrlPresent ? (
      <div className="flex h-12 max-w-[140px] items-center justify-start">
        <img className="h-full w-full object-contain object-left" src={TENANT_LOGO_URL} alt={`${TENANT_NAME} logo`} />
      </div>
    ) : (
      <div className="w-full text-left text-2xl font-bold capitalize text-gray-900">{TENANT_NAME}</div>
    );

    return (
      <div className="flex w-full items-center justify-start gap-2">
        {isUserSuperAdmin ? <Link to="/">{logoContent}</Link> : <div>{logoContent}</div>}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-32px)] w-[270px] flex-col overflow-hidden rounded-xl border bg-[#FCFCFD]">
      {/* Header - Company Logo & Name */}
      <div className="flex flex-col items-start justify-center gap-4 self-stretch px-4 py-4">
        <div className="flex w-full items-center justify-between px-2">{renderTenantHeader()}</div>
      </div>

      {/* Divider below logo */}
      <div className="mx-4 mb-4 border-t border-gray-200" />

      {/* Main Navigation */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4" type="always">
          {sideNavView === SideNavView.MAIN ? (
            // MAIN VIEW - Accordion Sections + Insights
            <div className="space-y-2">
              {SIDEBAR_V2_ACCORDION_SECTIONS.map((section) => (
                <React.Fragment key={section.title}>
                  <div className="space-y-1">
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleAccordion(section.title)}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-normal text-gray-700 hover:bg-gray-50"
                    >
                      <span>{section.title}</span>
                      {openAccordions[section.title] ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                    </button>

                    {/* Accordion Content with Animation */}
                    <AnimatePresence initial={false}>
                      {openAccordions[section.title] && (
                        <motion.div key={section.title} className="overflow-hidden" {...accordionAnimation}>
                          <div className="space-y-1 pl-2">{section.items.map((item) => renderNavItem(item))}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <hr />
                </React.Fragment>
              ))}

              {/* Insights Link - After accordions */}
              <div className="pt-2">{renderNavItem(INSIGHTS_ITEM)}</div>
            </div>
          ) : (
            // SETTINGS VIEW - Settings Items with Back Button
            <div className="space-y-2">
              <button
                onClick={navigateToMainView}
                className="mb-4 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>

              <div className="space-y-1">{SIDEBAR_V2_SETTINGS_ITEMS.map((item) => renderNavItem(item))}</div>
            </div>
          )}
        </ScrollArea>

        {/* Settings - Sticky at Bottom */}
        {sideNavView === SideNavView.MAIN && (
          <div className="p-4">
            <button
              onClick={navigateToSettingsView}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal text-gray-500 transition-all hover:bg-gray-100"
            >
              <div className="flex items-center rounded bg-white p-1">
                <PanelSettingsIcon className="h-4 w-4 flex-shrink-0" />
              </div>
              <span className="truncate">Settings</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarV2;
