export function validateUsername(username: string): boolean {
  // Check if the username is alphanumeric and between 1 and 32 characters long
  return /^[a-zA-Z0-9]{1,32}$/.test(username);
}

export function validatePassword(password: string, confirmPassword: string): boolean {
  // Check if the password is minimum 8 characters long
  if (password.length < 8) {
    return false;
  }

  // Check if the passwords match
  return password === confirmPassword;
}