import { GET_TOKEN, SET_COOKIE } from "@/constants/urls";
import { GetTokenInputType, GetTokenOutputType, SetCookieInputType } from "@/types/auth.types";
import { apiCaller } from "@/utils/apiCaller";

// export const login = (data: LoginInputsType, signal?: AbortSignal) =>
//   apiCaller<LoginOutputsType, LoginInputsType>(GET_TOKEN, "POST", data, signal);

export const getToken = (data: GetTokenInputType, signal?: AbortSignal) =>
  apiCaller<GetTokenOutputType, GetTokenInputType>(
    GET_TOKEN,
    "POST",
    data,
    signal
  );

  export const setCookie = (data: SetCookieInputType, signal?: AbortSignal) =>
    apiCaller<null, SetCookieInputType>(
      SET_COOKIE,
      "POST",
      data,
      signal
    );
