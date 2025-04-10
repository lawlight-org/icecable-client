import { AuthFormFields } from "../types/AuthFormFields";
import { FormError } from "../types/FormError";
import { FormErrors } from "../types/FormErrors";

export function validateUsername(username: string): boolean {
  // Check if the username is alphanumeric and between 1 and 32 characters long
  return /^[a-zA-Z0-9]{1,32}$/.test(username);
}

export function validateForm(
  formFields: AuthFormFields,
  isRegister: boolean
): FormErrors {
  const errors: FormErrors = {
    general: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  if (
    !formFields.username.value ||
    !formFields.password.value ||
    (isRegister && !formFields.confirmPassword.value)
  ) {
    errors.general = "Please fill out all the fields.";
  }

  if (!validateUsername(formFields.username.value)) {
    errors.username = "Invalid username";
  }

  if (formFields.password.value.length < 8) {
    errors.password = "Password has to be minimum 8 charaters long";
  }

  if (
    isRegister &&
    formFields.password.value !== formFields.confirmPassword.value
  ) {
    errors.confirmPassword = "Password too short or passwords do not match";
  }

  return errors;
}
