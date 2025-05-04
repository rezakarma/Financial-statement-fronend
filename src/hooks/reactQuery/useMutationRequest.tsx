import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import { useEffect } from "react";

type UseMutationRequestParams<TData, TError, TVariables> = {
  mutationFn: (variables: TVariables, signal: AbortSignal) => Promise<TData>;
  options?: UseMutationOptions<TData, TError, TVariables>;
};

export function useMutationRequest<TData, TError, TVariables>({
  mutationFn,
  options,
}: UseMutationRequestParams<TData, TError, TVariables>): UseMutationResult<
  TData,
  TError,
  TVariables
> {
  const abortController = new AbortController();
  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn: (variables) => mutationFn(variables, abortController.signal),
    ...options,
  });

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, []);

  return mutation;
}
