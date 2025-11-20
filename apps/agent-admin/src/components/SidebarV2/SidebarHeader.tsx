import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@breakout/design-system/lib/cn';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverPortal,
} from '@breakout/design-system/components/Popover/index';
import SidebarToggleIcon from '@breakout/design-system/components/icons/sidebar-toggle-icon';
import { OrganizationDetailsResponse } from '@meaku/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';
import { buildPathWithTenantBase } from '../../utils/navigation';
import { DEFAULT_ROUTE, SideNavView } from '../../utils/constants';
import toast from 'react-hot-toast';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  tenantName: string;
  tenantLogoUrl: string;
  faviconUrl: string;
  isTenantLogoUrlPresent: boolean;
  isUserSuperAdmin: boolean;
  organizations?: OrganizationDetailsResponse[];
  onExpandSidebar: () => void;
  onToggleCollapse: () => void;
  isHovered?: boolean;
  sideNavView?: SideNavView;
  onBackToMain?: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  tenantName,
  tenantLogoUrl,
  faviconUrl,
  isTenantLogoUrlPresent,
  isUserSuperAdmin,
  organizations,
  onExpandSidebar,
  onToggleCollapse,
  isHovered = false,
  sideNavView = SideNavView.MAIN,
  onBackToMain,
}) => {
  const navigate = useNavigate();
  const [isLogoPopoverOpen, setIsLogoPopoverOpen] = useState<boolean>(false);
  const [isLogoHovered, setIsLogoHovered] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const organization = useSessionStore((state) => state.activeTenant);

  // Filter organizations based on search query
  const filteredOrganizations = useMemo(() => {
    if (!searchQuery.trim()) {
      return organizations || [];
    }
    return (organizations || []).filter((org) => org.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [organizations, searchQuery]);

  // Handle click in collapsed mode - expand sidebar first, then open popover
  const handleCollapsedClick = () => {
    // Don't allow tenant selector to work in hovered state
    if (isHovered) {
      return;
    }
    onExpandSidebar();
    // Wait for sidebar expansion animation to complete (300ms)
    setTimeout(() => {
      setIsLogoPopoverOpen(true);
    }, 300);
  };

  const handleSelectOrganization = async (org: OrganizationDetailsResponse) => {
    try {
      setIsLogoPopoverOpen(false);

      const tenantName = org['tenant-name'] ?? '';
      navigate(buildPathWithTenantBase(tenantName, DEFAULT_ROUTE), { replace: true });
    } catch (error) {
      toast.error('Failed to switch organization');
      console.error('Error switching tenant:', error);
    }
  };

  const logoContent = isTenantLogoUrlPresent ? (
    <div className="flex h-12 max-w-[140px] items-center justify-start">
      <img className="h-full w-full object-contain object-left" src={tenantLogoUrl} alt={`${tenantName} logo`} />
    </div>
  ) : (
    <div className="w-full text-left text-2xl font-bold capitalize text-gray-900">{tenantName}</div>
  );

  // Collapsed icon content
  const collapsedIconContent = (
    <div className="flex h-8 w-8 items-center justify-center">
      {faviconUrl ? (
        <img
          src={faviconUrl}
          alt={`${tenantName} icon`}
          className="h-8 w-8 rounded object-contain"
          onError={(e) => {
            // Fallback to letter on error
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <span
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded bg-gray-900 text-sm font-bold text-white',
          faviconUrl && 'hidden',
        )}
      >
        {tenantName.charAt(0).toUpperCase()}
      </span>
    </div>
  );

  // If in settings view, show back button instead of tenant selector
  if (sideNavView === SideNavView.SETTINGS && onBackToMain) {
    const isExpanded = !isCollapsed;
    return (
      <div className="relative flex w-full items-center justify-start overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={isCollapsed ? 'back-collapsed' : 'back-expanded'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex w-full items-center justify-start"
          >
            <button
              onClick={onBackToMain}
              className={cn(
                'mt-4 flex h-10 items-center overflow-hidden rounded-lg text-sm font-normal font-semibold text-gray-900 transition-[colors,shadow,width] duration-200',
                {
                  'w-10 justify-center gap-0 px-2': !isExpanded,
                  '-ml-2 w-full gap-3 px-3': isExpanded,
                },
              )}
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="h-4 w-4 flex-shrink-0 stroke-[2] text-gray-900" />
              <span
                className={cn(
                  'inline-block overflow-hidden whitespace-nowrap text-sm transition-[max-width,opacity] duration-200 ease-out',
                  {
                    'max-w-0 opacity-0': !isExpanded,
                    'max-w-[156px] opacity-100': isExpanded,
                  },
                )}
              >
                Back
              </span>
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Toggle Button */}
        {!isHovered && (
          <button
            onClick={onToggleCollapse}
            className={`z-200 group absolute -bottom-4 flex size-4 translate-y-1/2 items-center overflow-visible rounded-md border border-gray-300 bg-white transition-all ${isCollapsed ? 'right-0' : '-right-2'}`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className="flex w-8 items-center justify-center">
              <SidebarToggleIcon className="h-4 w-4 !text-gray-500 opacity-100 transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-0" />
              {!isCollapsed ? (
                <ChevronLeft className="-ml-2 -mt-0.5 h-2.5 w-2.5 !text-gray-500 opacity-0 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:opacity-100" />
              ) : (
                <ChevronRight className="-ml-2 -mt-0.5 h-2.5 w-2.5 !text-gray-500 opacity-0 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:opacity-100" />
              )}
            </div>
          </button>
        )}
      </div>
    );
  }

  // If not super admin, render without popover
  if (!isUserSuperAdmin) {
    return (
      <div className="relative flex w-full items-center justify-start overflow-visible">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            // Collapsed mode - Show icon
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex h-8 w-8 items-center justify-center rounded"
            >
              {collapsedIconContent}
            </motion.div>
          ) : (
            // Expanded mode - Show logo
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex w-full items-center justify-start"
            >
              {logoContent}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button - Positioned at top right, half overflowing */}
        {!isHovered && (
          <button
            onClick={onToggleCollapse}
            className="z-200 group absolute -right-0 top-16 flex size-4 -translate-y-1/2 items-center overflow-visible rounded-lg border border-gray-300 bg-white transition-all"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className="flex w-8 items-center justify-center">
              <SidebarToggleIcon className="h-4 w-4 !text-gray-500 opacity-100 transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-0" />
              {!isCollapsed ? (
                <ChevronLeft className="-ml-2.5 -mt-0.5 h-2.5 w-2.5 !text-gray-500 opacity-0 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:opacity-100" />
              ) : (
                <ChevronRight className="-ml-2.5 -mt-0.5 h-2.5 w-2.5 !text-gray-500 opacity-0 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:opacity-100" />
              )}
            </div>
          </button>
        )}
      </div>
    );
  }

  // Super admin - render with popover
  return (
    <Popover
      open={isLogoPopoverOpen && !isHovered}
      onOpenChange={(open) => {
        // Don't allow popover to open in hovered state
        if (isHovered && open) {
          return;
        }
        setIsLogoPopoverOpen(open);
        // Clear search when closing popover
        if (!open) {
          setSearchQuery('');
        }
      }}
    >
      <div className="relative flex h-16 w-full items-center justify-center overflow-visible">
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            // Collapsed mode - Show icon (expands sidebar on click)
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex h-8 w-8 items-center justify-center rounded"
            >
              <button
                onClick={handleCollapsedClick}
                className={cn(
                  'flex h-8 w-8 items-center justify-center focus:outline-none',
                  isHovered ? 'pointer-events-none' : 'cursor-pointer',
                )}
              >
                {collapsedIconContent}
              </button>
            </motion.div>
          ) : (
            // Expanded mode - Show logo with hover arrow
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex w-full items-center justify-start"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    '-mx-2 flex h-14 w-[calc(100%+1rem)] items-center justify-between gap-2 rounded-lg border px-2 py-1 text-left transition-all duration-300 focus:outline-none',
                    !isHovered && (isLogoPopoverOpen || isLogoHovered) ? 'border-gray-200' : 'border-transparent',
                    isHovered ? 'pointer-events-none' : 'cursor-pointer',
                  )}
                >
                  <div className="flex-1">{logoContent}</div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 flex-shrink-0 text-gray-500',
                      !isHovered && (isLogoPopoverOpen || isLogoHovered) ? 'opacity-100' : 'opacity-0',
                      isLogoPopoverOpen && !isHovered && 'rotate-180',
                    )}
                  />
                </button>
              </PopoverTrigger>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button - Positioned at top right, half overflowing */}
        {!isHovered && (
          <button
            onClick={onToggleCollapse}
            className={`z-200 group absolute -bottom-4 flex size-4 translate-y-1/2 items-center overflow-visible rounded-md border border-gray-300 bg-white transition-all ${isCollapsed ? 'right-0' : '-right-2'}`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className="flex w-8 items-center justify-center">
              <SidebarToggleIcon className="h-4 w-4 !text-gray-500 opacity-100 transition-all duration-200 group-hover:-translate-x-1 group-hover:opacity-0" />
              {!isCollapsed ? (
                <ChevronLeft className="-ml-2 -mt-0.5 h-2.5 w-2.5 !text-gray-500 opacity-0 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:opacity-100" />
              ) : (
                <ChevronRight className="-ml-2 -mt-0.5 h-2.5 w-2.5 !text-gray-500 opacity-0 transition-all duration-200 group-hover:-translate-x-1.5 group-hover:opacity-100" />
              )}
            </div>
          </button>
        )}
      </div>
      <PopoverPortal>
        <PopoverContent
          side={isCollapsed ? 'right' : 'bottom'}
          align="start"
          sideOffset={8}
          style={{ width: 'var(--radix-popover-trigger-width)' }}
          className="zoom-in-y-95 data-[state=closed]:zoom-out-y-95 min-w-[300px] origin-top rounded-lg border border-gray-200 bg-gray-25 shadow-xl duration-200 animate-in fade-in-0 slide-in-from-top-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2"
        >
          {/* Search input */}
          <div className="border-b border-gray-200 p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Organizations list */}
          <div className="max-h-[560px] overflow-y-auto p-2">
            <div className="flex flex-col">
              {filteredOrganizations.map((org) => {
                const orgLogo = org.logo;
                const orgName = org.name || 'Unknown Organization';
                const orgTenantName = org['tenant-name'];
                const isCurrentTenant = orgTenantName === organization?.['tenant-name'];

                return (
                  <button
                    key={orgTenantName}
                    onClick={() => handleSelectOrganization(org)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-150',
                      isCurrentTenant ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100',
                    )}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded">
                      {orgLogo ? (
                        <img
                          src={orgLogo}
                          alt={`${orgName} icon`}
                          className="h-8 w-8 rounded bg-white object-contain"
                          onError={(e) => {
                            // Fallback to letter on error
                            e.currentTarget.style.display = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              e.currentTarget.nextElementSibling.classList.remove('hidden');
                            }
                          }}
                        />
                      ) : null}
                      <span
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded text-sm font-bold',
                          isCurrentTenant ? 'bg-white text-gray-900' : 'bg-gray-900 text-white',
                          orgLogo && 'hidden',
                        )}
                      >
                        {orgName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="flex-1 truncate text-sm font-medium">{orgName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};

export default SidebarHeader;
