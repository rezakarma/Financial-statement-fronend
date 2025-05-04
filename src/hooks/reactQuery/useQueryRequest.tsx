import { useQuery, QueryKey } from "@tanstack/react-query";

interface UseQueryRequestProps<TData, TQueryFnData> {
  queryFn: (context: TData) => Promise<TQueryFnData>;
  queryKey: QueryKey;
  data?: TData;
}

export const useQueryRequest = <TData, TQueryFnData>({
  queryFn,
  queryKey,
  data,
}: UseQueryRequestProps<TData, TQueryFnData>) => {
  const queryResult = useQuery<TQueryFnData>({
    queryKey,
    queryFn: () => queryFn(data as TData),
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    ...queryResult,
    refetch: queryResult.refetch, // Expose the refetch method
  };
};
