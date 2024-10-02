import { useLocalStorageState } from "ahooks";
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_KEYS } from "../constants/localStorage";
import { ChatParams } from "../types/msc";

const useAdminUserEmail = () => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const userEmailKey = `${LOCAL_STORAGE_KEYS.USER_EMAIL}-${orgName}-${agentId}`;

  const [userEmail, setUserEmail] = useLocalStorageState<string>(userEmailKey, {
    listenStorageChange: true,
  });

  return { userEmail, setUserEmail } as const;
};

export default useAdminUserEmail;
