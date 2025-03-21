import "./Login.css";
import { useAuth } from "../hooks/auth";
import { useState } from "react";
import { ChangeEvent, FormEvent } from "react";
import { validatePassword, validateUsername } from "../validators/accounts";
import { useNavigate } from "react-router-dom";

type FormFields = {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Login() {
  const { token, createAccount, createGuest, login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const [formFields, setFormFields] = useState<FormFields>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  }

  const [isRegister, setIsRegister] = useState<boolean>(true);

  const handleGuest = async () => {
    const res = await createGuest();
    if (res) {
      console.log(res);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateUsername(formFields.username)) {
      setError("Invalid username");
      return;
    }

    if (isRegister) {
      if (!validatePassword(formFields.password, formFields.confirmPassword)) {
        setError("Password too short or passwords do not match");
        return;
      }

      const res = await createAccount(formFields.username, formFields.password);
      if (!res) {
        setError("Failed to register, please try again");
        return;
      }
    }

    if (await login(formFields.username, formFields.password)) {
      navigate("/");
    }
  };

  return (
    <>
      <p>IceCable</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formFields.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formFields.password}
          onChange={handleChange}
        />

        {isRegister && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formFields.confirmPassword}
            onChange={handleChange}
          />
        )}

        <button type="submit">
          {isRegister ? "Register" : "Login"}
        </button>

        {error && <p>{error}</p>}
      </form>

      <button onClick={handleGuest}>Continue as guest</button>

      <span onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Login" : "Register"}
      </span>
    </>
  );
}
