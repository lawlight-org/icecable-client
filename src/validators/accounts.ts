import { AuthFormFields } from "../types/AuthFormFields";
import { FormError } from "../types/FormError";

export function validateUsername(username: string): boolean {
  // Check if the username is alphanumeric and between 1 and 32 characters long
  return /^[a-zA-Z0-9]{1,32}$/.test(username);
}

export function validatePassword(
  password: string,
  confirmPassword: string
): boolean {
  // Check if the password is minimum 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Check if the passwords match
  return password === confirmPassword;
}

export function validateForm(
  formFields: AuthFormFields,
  isRegister: boolean
): FormError[] {
  const errors: FormError[] = [];

  if (
    !formFields.username.value ||
    !formFields.password.value ||
    (isRegister && !formFields.confirmPassword.value)
  ) {
    errors.push({
      field: "general",
      error: "Please fill out all the fields."
    });
  }

  if (!validateUsername(formFields.username.value)) {
    errors.push({
      field: "username",
      error: "Invalid username",
    });
  }

  if (
    isRegister &&
    !validatePassword(
      formFields.password.value,
      formFields.confirmPassword.value
    )
  ) {
    errors.push({
      field: "password",
      error: "Password too short or passwords do not match",
    });
  }


  return errors;
}
