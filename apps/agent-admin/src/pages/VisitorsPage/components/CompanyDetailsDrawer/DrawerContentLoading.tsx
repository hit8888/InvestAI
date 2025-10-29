import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import { motion } from 'framer-motion';
import Typography from '@breakout/design-system/components/Typography/index';

const DrawerContentLoading = () => {
  return (
    <div className="flex flex-col gap-10">
      {/* Company Details Section Loading */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.05, ease: 'linear' }}>
        <Typography variant="caption-12-medium" className="mb-2 flex items-center">
          Company Details
        </Typography>
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4">
          {/* Company Header */}
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-3">
              {/* Company Logo */}
              <Skeleton className="h-11 w-11 rounded-full" />

              {/* Company Name and Website */}
              <div className="flex flex-col gap-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gray-100" />

          <div className="flex justify-between gap-2">
            <div className="flex flex-1 flex-col gap-4">
              {/* HQ */}
              <div className="flex">
                <Skeleton className="h-4 w-20" />
                <div className="px-3">:</div>
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Revenue */}
              <div className="flex">
                <Skeleton className="h-4 w-20" />
                <div className="px-3">:</div>
                <Skeleton className="h-4 w-16" />
              </div>

              {/* Employees */}
              <div className="flex">
                <Skeleton className="h-4 w-20" />
                <div className="px-3">:</div>
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Details Section Loading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.05, ease: 'linear' }}
        className="relative flex"
      >
        {/* Connection line SVG */}
        <div className="absolute -top-[45px] left-[4px]">
          <svg width="17" height="55" viewBox="0 0 17 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 0H17H1ZM17 54.5H9C4.30558 54.5 0.5 50.6944 0.5 46H1.5C1.5 50.1421 4.85786 53.5 9 53.5H17V54.5ZM9 54.5C4.30558 54.5 0.5 50.6944 0.5 46V0H1.5V46C1.5 50.1421 4.85786 53.5 9 53.5V54.5ZM17 0V54V0Z"
              fill="#EAECF0"
            />
          </svg>
        </div>

        <div className="ml-6 w-full">
          <Typography variant="caption-12-medium" className="mb-2 flex items-center">
            User Details
          </Typography>

          <div className="flex flex-col gap-2.5 rounded-2xl border border-gray-200 bg-gray-25 p-4">
            <div className="flex items-end gap-4">
              {/* User Avatar */}
              <Skeleton className="h-[42px] w-[42px] rounded-full border-2" />

              <div className="flex flex-1 flex-col gap-1">
                {/* User Name and Title */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-32" />
                  <div className="h-4 w-0 border-l border-gray-300" />
                  <Skeleton className="h-4 w-24" />
                </div>

                {/* Email */}
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>

            {/* Action buttons area */}
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-40" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Relevant Profiles Section Loading */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.05, ease: 'linear' }}>
        <Typography variant="caption-12-medium" className="mb-2 flex items-center">
          Relevant Profiles
        </Typography>
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </motion.div>

      {/* User Interaction Section Loading */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.05, ease: 'linear' }}>
        <Typography variant="caption-12-medium" className="mb-2 flex items-center">
          Browsing & Conversation Summary
        </Typography>
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DrawerContentLoading;
