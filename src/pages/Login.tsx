import "./Login.css";
import { useAuth } from "../hooks/auth";
import { useState } from "react";
import { ChangeEvent, FormEvent } from "react";
import {
  validateForm,
  validatePassword,
  validateUsername,
} from "../validators/accounts";
import { useNavigate } from "react-router-dom";
import { AuthFormFields } from "../types/AuthFormFields";

export default function Login() {
  const { token, createAccount, createGuest, login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const [formFields, setFormFields] = useState<AuthFormFields>({
    username: {
      value: "",
      type: "text",
      label: "Username",
      error: "",
    },
    password: {
      value: "",
      type: "password",
      label: "Password",
      error: "",
    },
    confirmPassword: {
      value: "",
      type: "password",
      label: "Confirm Password",
      error: "",
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormFields((prev) => ({
      ...prev,
      [e.target.name]: {
        ...prev[e.target.name as keyof AuthFormFields],
        value: e.target.value,
      },
    }));
  };

  const [isRegister, setIsRegister] = useState<boolean>(true);

  const handleGuest = async () => {
    const res = await createGuest();
    if (res) {
      console.log(res);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formFields);

    const errors = validateForm(formFields, isRegister);
    if (errors.length > 0) {
      if (errors.field === "general") {
        setError(errors.error);
        return;
      }

      setFormFields((prev) => {
        console.log(prev)
        Object.values(prev).map(field => { field.error=""; });

        return {
          ...prev,
          [errors.field]: {
            ...prev[errors.field as keyof AuthFormFields],
            error: errors.error,
          },
        };
      });
      return;
    }

    if (isRegister) {
      const res = await createAccount(
        formFields.username.value,
        formFields.password.value
      );
      if (!res) {
        setError("Failed to register, please try again");
        return;
      }
    }

    if (await login(formFields.username.value, formFields.password.value)) {
      navigate("/");
    }
  };

  return (
    <>
      <p>IceCable</p>

      <form onSubmit={handleSubmit}>
        {Object.keys(formFields).map((key) => {
          if (!isRegister && key === "confirmPassword") {
            return null;
          }

          const value = formFields[key as keyof AuthFormFields];

          return (
            <div key={key}>
              <input
                type={value.type}
                name={key}
                placeholder={value.label}
                value={value.value}
                onChange={handleChange}
              />
              {value.error && <p>{value.error}</p>}
            </div>
          );
        })}

        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      {error && <p>{error}</p>}

      <button onClick={handleGuest}>Continue as guest</button>

      <span onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Login" : "Register"}
      </span>
    </>
  );
}
