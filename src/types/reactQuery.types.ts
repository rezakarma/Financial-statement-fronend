import { AxiosError } from "axios";

export type OutputUseQueryType<Tdata> = {
  data: Tdata | undefined;
  error: Error | AxiosError | null | unknown;
  isLoading: boolean;
  isFetching?: boolean;
};