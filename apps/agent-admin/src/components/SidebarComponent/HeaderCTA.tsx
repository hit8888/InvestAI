// import AdminLogoSVG from '@breakout/design-system/components/icons/admin-logo-icon';
import PanelCloseIcon from '@breakout/design-system/components/icons/panel-close-icon';
import Separator from '@breakout/design-system/components/layout/separator';
import { cn } from '@breakout/design-system/lib/cn';
import { motion } from 'framer-motion';
import { getTenantIdentifier } from '@meaku/core/utils/index';
import { ADMIN_DASHBOARD_COMPANY_NAME, SideNavView } from '../../utils/constants';
import { useAuth } from '../../context/AuthProvider';
import { getTransitionAnimation } from '../../utils/common';
import { useSidebar } from '../../context/SidebarContext';
import Button from '@breakout/design-system/components/Button/index';
import { ArrowLeftIcon } from 'lucide-react';
import Typography from '@breakout/design-system/components/Typography/index';

const HeaderCTA = () => {
  const { isSidebarOpen: isOpen, toggleSidebar, sideNavView, navigateToMainView } = useSidebar();
  const { userInfo } = useAuth();
  const orgList = userInfo?.organizations;
  const isUserSuperAdmin = Boolean((orgList?.length ?? 0) > 1 && orgList?.every((org) => org?.role === 'admin'));
  const Container = isUserSuperAdmin ? 'a' : 'div';
  const containerProps = isUserSuperAdmin ? { href: '/' } : {};
  const TENANT_NAME = getTenantIdentifier()?.['name'] ?? ADMIN_DASHBOARD_COMPANY_NAME;
  const TENANT_LOGO_URL = getTenantIdentifier()?.['logo'] ?? '';
  const isTenantLogoUrlPresent = TENANT_LOGO_URL.length > 0;

  const renderBackToDashboardButton = () => {
    return (
      <Button
        variant="tertiary"
        size="regular"
        onClick={navigateToMainView}
        className="w-full items-center justify-center"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {isOpen && (
          <Typography variant="label-14-semibold" className="text-primary">
            Back to Dashboard
          </Typography>
        )}
      </Button>
    );
  };

  const renderTenantLogo = () => {
    return (
      <div
        className={cn('flex w-full items-center gap-2', {
          'justify-start': isTenantLogoUrlPresent,
        })}
      >
        {isTenantLogoUrlPresent && (
          <Container
            {...containerProps}
            className={cn('flex h-12 items-center', {
              'justify-center': isOpen,
            })}
          >
            <img className="h-full w-full object-contain" src={TENANT_LOGO_URL} alt={`${TENANT_NAME} logo`} />
          </Container>
        )}
        {!isTenantLogoUrlPresent ? (
          <motion.a
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn('text-left font-bold capitalize text-gray-900 transition-all duration-300', {
              'w-full text-2xl': isOpen,
              'w-16 truncate text-xs': !isOpen,
            })}
          >
            {TENANT_NAME}
          </motion.a>
        ) : null}
      </div>
    );
  };

  const isMainView = sideNavView === SideNavView.MAIN;

  return (
    <div className="flex flex-col items-start justify-center gap-4 self-stretch border border-[rgb(var(--primary-foreground)/0.32)] bg-primary/2.5 px-4 py-2">
      <motion.div
        className={cn('flex w-full items-center justify-between px-2 pb-2', {
          'flex-row p-0': isOpen,
          'flex-col p-0': !isOpen,
          'justify-between': isTenantLogoUrlPresent,
          'justify-start': !isTenantLogoUrlPresent,
        })}
        {...getTransitionAnimation()}
      >
        {isMainView ? renderTenantLogo() : renderBackToDashboardButton()}
      </motion.div>
      {isMainView && (
        <div className="relative w-full">
          <button
            onClick={toggleSidebar}
            className={cn(
              `sidebar-collapsible-btn-shadow absolute -right-8 -top-3 z-50 flex h-6 w-6 items-center justify-center
            rounded-full border border-gray-200 bg-gray-25`,
              {
                'border-primary': !isOpen,
              },
            )}
          >
            <PanelCloseIcon
              className={cn(`z-50 h-3 w-3 text-primary transition-transform duration-300 `, {
                'rotate-0': isOpen,
                'rotate-180': !isOpen,
              })}
            />
          </button>
          <Separator className="w-[95%]" />
        </div>
      )}
    </div>
  );
};

export default HeaderCTA;
