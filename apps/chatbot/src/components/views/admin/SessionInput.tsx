import { SessionHashDataSchema } from "@meaku/core/types/session";
import WrappedLogo from "@meaku/ui/components/icons/wrapped-logo";
import Button from "@meaku/ui/components/layout/button";
import Input from "@meaku/ui/components/layout/input";
import { FormEvent, memo, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useConfigData from "../../../hooks/query/useConfigData";
import UnifiedResponseManager from "../../../managers/UnifiedResponseManager";
import { useAdminStore } from "../../../stores/useAdminStore";

const SUPERADMIN_PASSWORD = "VzEsWuLDN4wg0335/KVxjg==";

const SessionInput = () => {
  const [sessionHash, setSessionHash] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const setIsAuthenticated = useAdminStore((state) => state.setIsAuthenticated);

  const setSessionId = useAdminStore((state) => state.setSessionId);
  const setProspectId = useAdminStore((state) => state.setProspectId);

  const { data: config } = useConfigData();

  const manager = useMemo(() => {
    if (!config) return;

    return new UnifiedResponseManager(config);
  }, [config]);

  const agentName = manager?.getAgentName() ?? "";

  const handleFormSubmission = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!sessionHash || !password) return;

    if (password !== SUPERADMIN_PASSWORD) {
      // This is a misleading error message and is there to not reveal that the password is wrong in order to avoid any sort of brute force attack.
      toast.error("Invalid session hash. Please try again.");
      return;
    }

    try {
      const decodedSessionHash = atob(sessionHash);
      const parsedSessionData = JSON.parse(decodedSessionHash);

      const sessionDataValidation =
        SessionHashDataSchema.safeParse(parsedSessionData);

      if (!sessionDataValidation.success) {
        throw new Error("Invalid session data.");
      }

      const { sessionId, prospectId } = sessionDataValidation.data;

      setSessionId(sessionId);
      setProspectId(prospectId);

      setIsAuthenticated(true);
    } catch (error) {
      toast.error("Invalid session hash. Please try again.");
    }
  };

  return (
    <div className="ui-flex ui-h-full ui-w-full ui-items-center ui-justify-center">
      <div className="ui-flex ui-flex-col ui-items-center ui-space-y-8">
        <div className="ui-rounded-full ui-shadow-2xl ui-shadow-primary">
          <WrappedLogo size="lg" />
        </div>

        <div className="ui-space-y-2 ui-text-center">
          <div className="ui-flex ui-items-start ui-justify-center ui-gap-1">
            <h1 className="ui-text-2xl ui-font-medium ui-text-gray-800">
              Hello! I'm Ada, {agentName}'s debugging expert.
            </h1>
            <span className="ui-animate-wave">👋</span>
          </div>
          <p className="ui-text-gray-700">
            Peek behind the scenes and watch {agentName} in action. Let's start
            by filling in the following details:
          </p>
        </div>

        <form
          className="ui-flex ui-w-full ui-flex-col ui-items-end ui-gap-4"
          onSubmit={handleFormSubmission}
        >
          <div className="ui-flex ui-w-full ui-flex-col ui-gap-3">
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
