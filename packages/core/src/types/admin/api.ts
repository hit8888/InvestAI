export type LoginWithEmailPasswordPayload = {
  email: string;
  password: string;
};

export type GenerateOtpPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  code: string;
};
