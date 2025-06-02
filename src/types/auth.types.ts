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

export interface ApiMessageReponse {
  status: true;
  message: string;
}

export interface MenyArray {
  id: number;
  parentId: number;
  linkName: string;
  hasChild: true;
  icon: string;
  to: string;
  import: string;
  checkflag: true;
  child: MenyArray[];
}

export type GetUserInfoDataOutputType = {
  data: {
    userData: {
      name: string;
      id: string;
      holdingCompanyID: number;
      holdingCompanyName: string;
      companyID: number;
      companyName: string;
    };
    menuArray: MenyArray[];
  };
};

export type GetUserInfoOutputType = ApiMessageReponse &
  GetUserInfoDataOutputType;
