export type InviteCodeData = {
  _id: string;
  welfare: string;
  code: string;
  active: boolean;
  issuedAt: string;
  scanCount: number;
};

export type InviteCodeResponse = {
  statusCode: number;
  message: string;
  data: {
    active: InviteCodeData | null;
    history: InviteCodeData[];
  };
};

export type InviteCodeIssueResponse = {
  statusCode: number;
  message: string;
  data: InviteCodeData;
};
