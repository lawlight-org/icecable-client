type AuthFormField = {
  value: string;
  type: string;
  label: string;
  error: string;
}

export type AuthFormFields = {
  username: AuthFormField;
  password: AuthFormField;
  confirmPassword: AuthFormField;
}