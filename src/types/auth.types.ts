export interface GetTokenInputType {
  userName: string;
  password: string;
}

export interface GetTokenOutputType {
  status: boolean;
  message: string;
  data: {
    uid: string;
  };
}

export interface SetCookieInputType {
  uid: string;
}
