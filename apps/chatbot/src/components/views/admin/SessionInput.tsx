import WrappedLogo from '@breakout/design-system/components/icons/wrapped-logo';
import Button from '@breakout/design-system/components/layout/button';
import Input from '@breakout/design-system/components/layout/input';
import { FormEvent, memo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../../stores/useAdminStore';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager';

const SUPERADMIN_PASSWORD = 'VzEsWuLDN4wg0335/KVxjg==';

const SessionInput = () => {
  const [sessionHash, setSessionHash] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const setSessionId = useAdminStore((state) => state.setSessionId);
  const setProspectId = useAdminStore((state) => state.setProspectId);

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();

  const agentName = unifiedConfigurationResponseManager.getAgentName() ?? '';

  const handleFormSubmission = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!sessionHash || !password) return;

    if (password !== SUPERADMIN_PASSWORD) {
      // This is a misleading error message and is there to not reveal that the password is wrong in order to avoid any sort of brute force attack.
      toast.error('Invalid session hash. Please try again.');
      return;
    }

    try {
      const [sessionId, prospectId] = sessionHash.split('|');

      if (!sessionId || !prospectId) {
        throw new Error('Invalid session hash.');
      }

      setSessionId(sessionId);
      setProspectId(prospectId);
    } catch {
      toast.error('Invalid session hash. Please try again.');
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        <div className="rounded-full shadow-2xl shadow-primary">
          <WrappedLogo size="lg" />
        </div>

        <div className="space-y-2 text-center">
          <div className="flex items-start justify-center gap-1">
            <h1 className="text-2xl font-medium text-gray-800">Hello! I'm Ada, {agentName}'s debugging expert.</h1>
            <span className="animate-wave">👋</span>
          </div>
          <p className="text-gray-700">
            Peek behind the scenes and watch {agentName} in action. Let's start by filling in the following details:
          </p>
        </div>

        <form className="flex w-full flex-col items-end gap-4" onSubmit={handleFormSubmission}>
          <div className="flex w-full flex-col gap-3">
            <Input
              value={sessionHash}
              onChange={(e) => setSessionHash(e.target.value)}
              placeholder="Enter session hash"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter superadmin password"
              type="password"
            />
          </div>
          <Button disabled={!sessionHash || !password} type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default memo(SessionInput);
