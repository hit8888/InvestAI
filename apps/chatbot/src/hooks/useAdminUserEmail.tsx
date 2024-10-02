import { useLocalStorageState } from "ahooks";
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_KEYS } from "../constants/localStorage";
import { ChatParams } from "../types/msc";
import useUpdateProspect from "./mutation/useUpdateProspect";
import useIsAdmin from "./useIsAdmin";
import useLocalStorageSession from "./useLocalStorageSession";

const useAdminUserEmail = () => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const userEmailKey = `${LOCAL_STORAGE_KEYS.USER_EMAIL}-${orgName}-${agentId}`;

  const isAdmin = useIsAdmin();
  const { mutateAsync: handleUpdateProspect } = useUpdateProspect();

  const [userEmail, setUserEmail] = useLocalStorageState<string>(userEmailKey, {
    listenStorageChange: true,
  });
  const { sessionData } = useLocalStorageSession();

  const handleSetUserEmail = async (email: string) => {
    setUserEmail(email);

    if (isAdmin) {
      await handleUpdateProspect({
        prospectId: sessionData.prospectId as string,
        payload: {
          email,
        },
      });
    }
  };

  return { userEmail, setUserEmail: handleSetUserEmail } as const;
};

export default useAdminUserEmail;
