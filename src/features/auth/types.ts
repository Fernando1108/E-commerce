export type AuthStatus = 'idle' | 'loading' | 'success' | 'error';

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
};

export type AuthActionResult = {
  message: string;
};

export type LoginResult = AuthActionResult & {
  user: AuthUser;
};

export type RegisterResult = AuthActionResult & {
  user: AuthUser;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};
