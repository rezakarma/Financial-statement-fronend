import { useQueryRequest } from "@/hooks/reactQuery/useQueryRequest";
import { GetUserInf } from "@/services/auth/authServices";
import { GetUserInfoOutputType } from "@/types/auth.types";
import { OutputUseQueryType } from "@/types/reactQuery.types";

const Provider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const {
    data: UserInfo,
    isLoading,
  }: OutputUseQueryType<GetUserInfoOutputType> = useQueryRequest({
    queryFn: GetUserInf,
    queryKey: ["user-info"],
  });

  console.log(data)
  return <div></div>;
};

export default Provider;
